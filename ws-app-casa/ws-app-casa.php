<?php 
include('config.php');
header ('Access-Control-Allow-Origin: *');
header ('Access-Control-Allow-Credentials:true');
header ('Access-Control-Allow-Methods: PUT,GET,POST,DELETE,OPTIONS');
header ('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, Accept, X-Requested-With, x-xsrf-token');
header ('ContentType:application/json; charset=utf-8');
$post= json_decode(file_get_contents("php://input"), true);
$respuesta="";

if ($post['accion'] == "login") {
    $email = $post['email'];
    $contrasena = $post['contrasena'];

    // Buscar al usuario solo por email
    $sentencia = sprintf("
        SELECT 
            u.id_usuario, 
            u.nombres_completos, 
            u.id_rol,
            r.nombre_rol,
            u.contrasena
        FROM 
            usuarios u
        INNER JOIN 
            roles r ON u.id_rol = r.id_rol
        WHERE 
            u.email = '%s'",
        mysqli_real_escape_string($mysqli, $email));
    
    $result = mysqli_query($mysqli, $sentencia);

    if (mysqli_num_rows($result) > 0) {
        $usuario = mysqli_fetch_assoc($result);

        // Verificar la contraseña
        if (password_verify($contrasena, $usuario['contrasena'])) {
            // Login exitoso
            $respuesta = array(
                'estado' => true,
                'mensaje' => 'Login exitoso',
                'usuario' => array(
                    'id_usuario' => $usuario['id_usuario'],
                    'nombres_completos' => $usuario['nombres_completos'],
                    'id_rol' => $usuario['id_rol'],
                    'nombre_rol' => $usuario['nombre_rol']
                )
            );
        } else {
            // Contraseña incorrecta
            $respuesta = array(
                'estado' => false,
                'mensaje' => 'Credenciales incorrectas'
            );
        }
    } else {
        // Email no encontrado
        $respuesta = array(
            'estado' => false,
            'mensaje' => 'Credenciales incorrectas'
        );
    }

    echo json_encode($respuesta);
}

if ($post['accion'] == "cargarCasas") {
    $provincia = isset($post['provincia']) ? $post['provincia'] : '';
    $ciudad = isset($post['ciudad']) ? $post['ciudad'] : '';
    $estado = isset($post['estado']) ? $post['estado'] : '';
    $direccion = isset($post['direccion']) ? $post['direccion'] : '';

    $where = "WHERE 1=1";
    if (!empty($provincia)) {
        $where .= sprintf(" AND provincia = '%s'", mysqli_real_escape_string($mysqli, $provincia));
    }
    if (!empty($ciudad)) {
        $where .= sprintf(" AND ciudad = '%s'", mysqli_real_escape_string($mysqli, $ciudad));
    }
    if (!empty($estado)) {
        $where .= sprintf(" AND estado = '%s'", mysqli_real_escape_string($mysqli, $estado));
    }
    if (!empty($direccion)) {
        $where .= sprintf(" AND direccion LIKE '%%%s%%'", mysqli_real_escape_string($mysqli, $direccion));
    }

    $sentencia = "SELECT 
                    id_casa, 
                    direccion, 
                    precio, 
                    dimensiones, 
                    habitaciones, 
                    banos, 
                    descripcion, 
                    estado, 
                    provincia, 
                    ciudad, 
                    imagen 
                  FROM casas 
                  $where 
                  ORDER BY provincia, ciudad, direccion";

    $result = mysqli_query($mysqli, $sentencia);

    if (mysqli_num_rows($result) > 0) {
        $casas = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $casas[] = $row;
        }
        $respuesta = array('estado' => true, 'casas' => $casas);
    } else {
        $respuesta = array('estado' => false, 'mensaje' => 'No se encontraron casas con los filtros seleccionados');
    }
    
    echo json_encode($respuesta);
}

elseif ($post['accion'] == "cargarCasa") {
    $id = isset($post['id']) ? $post['id'] : null;
    
    if (!$id) {
        $respuesta = array('estado' => false, 'mensaje' => 'ID no proporcionado');
        echo json_encode($respuesta);
        exit;
    }

    $sentencia = $mysqli->prepare("SELECT 
                                    id_casa, 
                                    direccion, 
                                    precio, 
                                    dimensiones, 
                                    habitaciones, 
                                    banos, 
                                    descripcion, 
                                    estado, 
                                    provincia, 
                                    ciudad, 
                                    imagen 
                                  FROM casas 
                                  WHERE id_casa = ?");
    $sentencia->bind_param("s", $id);
    $sentencia->execute();
    $result = $sentencia->get_result();

    if ($result->num_rows > 0) {
        $casa = $result->fetch_assoc();
        $respuesta = array('estado' => true, 'casa' => $casa);
    } else {
        $respuesta = array('estado' => false, 'mensaje' => 'Casa no encontrada');
    }
    
    // Debug: Ver la respuesta que se envía
    error_log("Respuesta: " . json_encode($respuesta));
    
    echo json_encode($respuesta);
    exit;
}

// Guardar nueva casa
elseif ($post['accion'] == "guardarCasa") {
    $datos = $post['datos'];

    $sentencia = sprintf("INSERT INTO casas (
                            direccion, 
                            precio, 
                            dimensiones, 
                            habitaciones, 
                            banos, 
                            descripcion, 
                            estado, 
                            provincia, 
                            ciudad, 
                            imagen
                          ) VALUES (
                            '%s', %f, '%s', %d, %d, '%s', '%s', '%s', '%s', '%s'
                          )",
                          mysqli_real_escape_string($mysqli, $datos['direccion']),
                          floatval($datos['precio']),
                          mysqli_real_escape_string($mysqli, $datos['dimensiones']),
                          intval($datos['habitaciones']),
                          intval($datos['banos']),
                          mysqli_real_escape_string($mysqli, $datos['descripcion']),
                          mysqli_real_escape_string($mysqli, $datos['estado']),
                          mysqli_real_escape_string($mysqli, $datos['provincia']),
                          mysqli_real_escape_string($mysqli, $datos['ciudad']),
                          mysqli_real_escape_string($mysqli, $datos['imagen']));

    if (mysqli_query($mysqli, $sentencia)) {
        $id = mysqli_insert_id($mysqli);
        $respuesta = array('estado' => true, 'mensaje' => 'Casa guardada correctamente', 'id' => $id);
    } else {
        $respuesta = array('estado' => false, 'mensaje' => 'Error al guardar la casa: ' . mysqli_error($mysqli));
    }
}

// Editar casa existente
elseif ($post['accion'] == "editarCasa") {
    $id = $post['id'];
    $datos = $post['datos'];

    $sentencia = sprintf("UPDATE casas SET
                            direccion = '%s',
                            precio = %f,
                            dimensiones = '%s',
                            habitaciones = %d,
                            banos = %d,
                            descripcion = '%s',
                            estado = '%s',
                            provincia = '%s',
                            ciudad = '%s',
                            imagen = '%s'
                          WHERE id_casa = '%s'",
                          mysqli_real_escape_string($mysqli, $datos['direccion']),
                          floatval($datos['precio']),
                          mysqli_real_escape_string($mysqli, $datos['dimensiones']),
                          intval($datos['habitaciones']),
                          intval($datos['banos']),
                          mysqli_real_escape_string($mysqli, $datos['descripcion']),
                          mysqli_real_escape_string($mysqli, $datos['estado']),
                          mysqli_real_escape_string($mysqli, $datos['provincia']),
                          mysqli_real_escape_string($mysqli, $datos['ciudad']),
                          mysqli_real_escape_string($mysqli, $datos['imagen']),
                          mysqli_real_escape_string($mysqli, $id));

    if (mysqli_query($mysqli, $sentencia)) {
        $respuesta = array('estado' => true, 'mensaje' => 'Casa actualizada correctamente');
    } else {
        $respuesta = array('estado' => false, 'mensaje' => 'Error al actualizar la casa: ' . mysqli_error($mysqli));
    }
}

// Eliminar casa
elseif ($post['accion'] == "eliminarCasa") {
    $id = $post['id'];

    $sentencia = sprintf("DELETE FROM casas WHERE id_casa = '%s'",
                          mysqli_real_escape_string($mysqli, $id));

    if (mysqli_query($mysqli, $sentencia)) {
        $respuesta = array('estado' => true, 'mensaje' => 'Casa eliminada correctamente');
    } else {
        $respuesta = array('estado' => false, 'mensaje' => 'Error al eliminar la casa: ' . mysqli_error($mysqli));
    }
}
elseif ($post['accion'] == "guardarCita") {
    $id_casa = isset($post['id_casa']) ? $mysqli->real_escape_string($post['id_casa']) : null;
    $id_asesor = isset($post['id_asesor']) ? $mysqli->real_escape_string($post['id_asesor']) : null;
    $id_cliente = isset($post['id_cliente']) ? $mysqli->real_escape_string($post['id_cliente']) : null;
    $fecha = isset($post['fecha']) ? $mysqli->real_escape_string($post['fecha']) : null;
    $hora = isset($post['hora']) ? $mysqli->real_escape_string($post['hora']) : null;

    // Validar datos requeridos
    if (!$id_casa || !$id_asesor || !$id_cliente || !$fecha || !$hora) {
        echo json_encode(['estado' => false, 'mensaje' => 'Todos los campos son obligatorios']);
        exit;
    }

    $stmt = $mysqli->prepare("INSERT INTO citas (
        id_casa, 
        id_asesor, 
        id_cliente, 
        fecha, 
        hora, 
        estado
    ) VALUES (?, ?, ?, ?, ?, 'Pendiente')");
    
    $stmt->bind_param("sssss", $id_casa, $id_asesor, $id_cliente, $fecha, $hora);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Cita agendada correctamente']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al guardar cita: ' . $mysqli->error]);
    }
    
    
    exit;
}
elseif ($post['accion'] == "buscarUsuariosPorRol") {
    $rol = isset($post['rol']) ? $mysqli->real_escape_string($post['rol']) : '';
    $busqueda = isset($post['busqueda']) ? $mysqli->real_escape_string($post['busqueda']) : '';

    $where = "WHERE r.nombre_rol = '$rol'";
    
    if (!empty($busqueda)) {
        $where .= " AND u.nombres_completos LIKE '%$busqueda%'";
    }

    $query = "SELECT 
                u.id_usuario, 
                u.nombres_completos, 
                u.direccion, 
                u.telefono, 
                u.email,
                r.nombre_rol
              FROM usuarios u
              INNER JOIN roles r ON u.id_rol = r.id_rol
              $where
              ORDER BY u.nombres_completos";

    $result = $mysqli->query($query);

    if ($result && $result->num_rows > 0) {
        $usuarios = array();
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }
        echo json_encode(['estado' => true, 'usuarios' => $usuarios]);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'No se encontraron usuarios']);
    }
    exit;
}
elseif ($post['accion'] == "cargarCitas") {
    $query = "SELECT 
                c.id_cita,
                c.fecha,
                c.hora,
                c.estado,
                casa.direccion as direccion_casa,
                cliente.nombres_completos as nombre_cliente,
                asesor.nombres_completos as nombre_asesor
              FROM citas c
              INNER JOIN casas casa ON c.id_casa = casa.id_casa
              INNER JOIN usuarios cliente ON c.id_cliente = cliente.id_usuario
              INNER JOIN usuarios asesor ON c.id_asesor = asesor.id_usuario
              ORDER BY c.fecha DESC, c.hora DESC";

    $result = $mysqli->query($query);

    if ($result && $result->num_rows > 0) {
        $citas = array();
        while ($row = $result->fetch_assoc()) {
            $citas[] = $row;
        }
        echo json_encode(['estado' => true, 'citas' => $citas]);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'No se encontraron citas']);
    }
    exit;
}

elseif ($post['accion'] == "eliminarCita") {
    $id = isset($post['id']) ? $mysqli->real_escape_string($post['id']) : null;

    if (!$id) {
        echo json_encode(['estado' => false, 'mensaje' => 'ID no proporcionado']);
        exit;
    }

    $stmt = $mysqli->prepare("DELETE FROM citas WHERE id_cita = ?");
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Cita eliminada correctamente']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al eliminar cita']);
    }

   
    exit;
}

elseif ($post['accion'] == "cargarCita") {
    $id = isset($post['id']) ? $mysqli->real_escape_string($post['id']) : null;

    if (!$id) {
        echo json_encode(['estado' => false, 'mensaje' => 'ID no proporcionado']);
        exit;
    }

    $query = "SELECT 
                c.id_cita,
                c.fecha,
                c.hora,
                c.estado,
                c.id_casa,
                c.id_asesor,
                c.id_cliente,
                asesor.nombres_completos as nombre_asesor,
                asesor.telefono as telefono_asesor,
                cliente.nombres_completos as nombre_cliente,
                cliente.telefono as telefono_cliente,
                casa.direccion
              FROM citas c
              INNER JOIN usuarios asesor ON c.id_asesor = asesor.id_usuario
              INNER JOIN usuarios cliente ON c.id_cliente = cliente.id_usuario
              INNER JOIN casas casa ON c.id_casa = casa.id_casa
              WHERE c.id_cita = '$id'";

    $result = $mysqli->query($query);

    if ($result && $result->num_rows > 0) {
        $cita = $result->fetch_assoc();
        echo json_encode(['estado' => true, 'cita' => $cita]);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Cita no encontrada']);
    }
    exit;
}

elseif ($post['accion'] == "editarCita") {
    $id_cita = isset($post['id_cita']) ? $mysqli->real_escape_string($post['id_cita']) : null;
    $id_casa = isset($post['id_casa']) ? $mysqli->real_escape_string($post['id_casa']) : null;
    $id_asesor = isset($post['id_asesor']) ? $mysqli->real_escape_string($post['id_asesor']) : null;
    $id_cliente = isset($post['id_cliente']) ? $mysqli->real_escape_string($post['id_cliente']) : null;
    $fecha = isset($post['fecha']) ? $mysqli->real_escape_string($post['fecha']) : null;
    $hora = isset($post['hora']) ? $mysqli->real_escape_string($post['hora']) : null;

    if (!$id_cita || !$id_casa || !$id_asesor || !$id_cliente || !$fecha || !$hora) {
        echo json_encode(['estado' => false, 'mensaje' => 'Todos los campos son obligatorios']);
        exit;
    }

    $stmt = $mysqli->prepare("UPDATE citas SET
                              id_casa = ?,
                              id_asesor = ?,
                              id_cliente = ?,
                              fecha = ?,
                              hora = ?
                              WHERE id_cita = ?");
    
    $stmt->bind_param("ssssss", $id_casa, $id_asesor, $id_cliente, $fecha, $hora, $id_cita);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Cita actualizada correctamente']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al actualizar cita: ' . $mysqli->error]);
    }
    exit;
}
elseif ($post['accion'] == "cargarCitasAsesor") {
    $id_asesor = isset($post['id_asesor']) ? $mysqli->real_escape_string($post['id_asesor']) : null;
    $busqueda = isset($post['busqueda']) ? $mysqli->real_escape_string($post['busqueda']) : '';

    if (!$id_asesor) {
        echo json_encode(['estado' => false, 'mensaje' => 'ID de asesor no proporcionado']);
        exit;
    }

    $where = "WHERE c.id_asesor = '$id_asesor'";
    
    if (!empty($busqueda)) {
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $busqueda)) {
            $where .= " AND c.fecha = '$busqueda'";
        } else {
            $where .= " AND cliente.nombres_completos LIKE '%$busqueda%'";
        }
    }

    $query = "SELECT 
                c.id_cita,
                c.fecha,
                c.hora,
                c.estado,
                casa.direccion as direccion_casa,
                casa.provincia,
                casa.ciudad,
                cliente.nombres_completos as nombre_cliente,
                cliente.telefono as telefono_cliente
              FROM citas c
              INNER JOIN casas casa ON c.id_casa = casa.id_casa
              INNER JOIN usuarios cliente ON c.id_cliente = cliente.id_usuario
              $where
              ORDER BY c.fecha DESC, c.hora DESC";

    $result = $mysqli->query($query);

    if ($result && $result->num_rows > 0) {
        $citas = array();
        while ($row = $result->fetch_assoc()) {
            $citas[] = $row;
        }
        echo json_encode(['estado' => true, 'citas' => $citas]);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'No se encontraron citas']);
    }
    exit;
}
elseif ($post['accion'] == "buscarNegociacion") {
    $id_cita = isset($post['id_cita']) ? $mysqli->real_escape_string($post['id_cita']) : null;

    if (!$id_cita) {
        echo json_encode(['estado' => false, 'mensaje' => 'ID de cita no proporcionado']);
        exit;
    }

    $stmt = $mysqli->prepare("SELECT * FROM negociaciones WHERE id_cita = ?");
    $stmt->bind_param("s", $id_cita);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $negociacion = $result->fetch_assoc();
        echo json_encode(['estado' => true, 'negociacion' => $negociacion]);
    } else {
        echo json_encode(['estado' => false]);
    }
    exit;
}

elseif ($post['accion'] == "crearNegociacion") {
    // Inicializar respuesta
    $respuesta = ['estado' => false, 'mensaje' => 'Error desconocido'];
    
    // Validar datos requeridos
    $id_cita = isset($post['id_cita']) ? $mysqli->real_escape_string($post['id_cita']) : null;
    $tipo_pago = isset($post['tipo_pago']) ? $mysqli->real_escape_string($post['tipo_pago']) : null;
    $monto = isset($post['monto']) ? floatval($post['monto']) : null;
    $estado = isset($post['estado']) ? $mysqli->real_escape_string($post['estado']) : 'Pendiente';
    $detalles = isset($post['detalles']) ? $mysqli->real_escape_string($post['detalles']) : null;

    if (!$id_cita || !$tipo_pago || !$monto) {
        echo json_encode(['estado' => false, 'mensaje' => 'Datos incompletos']);
        exit;
    }

    // Iniciar transacción
    $mysqli->begin_transaction();

    try {
        // 1. Crear la negociación
        $stmt = $mysqli->prepare("INSERT INTO negociaciones 
                                (id_cita, tipo_pago, monto, estado, detalles, fecha_negociacion) 
                                VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param("ssdss", $id_cita, $tipo_pago, $monto, $estado, $detalles);

        if (!$stmt->execute()) {
            throw new Exception("Error al crear negociación: " . $mysqli->error);
        }

        $id_negociacion = $mysqli->insert_id;

        // 2. Obtener información de la casa y fecha de negociación
        $consulta = "SELECT 
                        n.fecha_negociacion,
                        c.id_casa,
                        ci.id_cita as id_cita_actual
                     FROM negociaciones n
                     JOIN citas ci ON n.id_cita = ci.id_cita
                     JOIN casas c ON ci.id_casa = c.id_casa
                     WHERE n.id_negociacion = ?";
        
        $stmt = $mysqli->prepare($consulta);
        $stmt->bind_param("i", $id_negociacion);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            throw new Exception("No se pudo obtener información de la negociación recién creada");
        }

        $datos = $result->fetch_assoc();
        $fecha_negociacion = $datos['fecha_negociacion'];
        $id_casa = $datos['id_casa'];
        $id_cita_actual = $datos['id_cita_actual'];

        // 3. Eliminar citas futuras para esta casa (excepto la actual)
        $eliminar = "DELETE FROM citas 
                     WHERE id_casa = ? 
                     AND CONCAT(fecha, ' ', hora) > ?
                     AND id_cita != ?";
        
        $stmt = $mysqli->prepare($eliminar);
        $stmt->bind_param("iss", $id_casa, $fecha_negociacion, $id_cita_actual);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al eliminar citas futuras: " . $mysqli->error);
        }

        $citas_eliminadas = $stmt->affected_rows;

        // 4. Actualizar estado de la casa si la negociación está completada
        if ($estado == 'Completada') {
            $stmt = $mysqli->prepare("UPDATE casas SET estado = 'Vendido' WHERE id_casa = ?");
            $stmt->bind_param("i", $id_casa);
            
            if (!$stmt->execute()) {
                throw new Exception("Error al actualizar estado de la casa: " . $mysqli->error);
            }
        }

        // Confirmar transacción
        $mysqli->commit();

        // Preparar respuesta exitosa
        $respuesta = [
            'estado' => true, 
            'mensaje' => 'Negociación creada exitosamente',
            'id_negociacion' => $id_negociacion,
            'citas_eliminadas' => $citas_eliminadas,
            'casa_actualizada' => ($estado == 'Completada') ? 'Vendido' : false
        ];

    } catch (Exception $e) {
        // Revertir transacción en caso de error
        $mysqli->rollback();
        $respuesta = [
            'estado' => false,
            'mensaje' => $e->getMessage()
        ];
    }

    echo json_encode($respuesta);
    exit;
}


elseif ($post['accion'] == "actualizarNegociacion") {
    $id_negociacion = isset($post['id_negociacion']) ? $mysqli->real_escape_string($post['id_negociacion']) : null;
    $tipo_pago = isset($post['tipo_pago']) ? $mysqli->real_escape_string($post['tipo_pago']) : null;
    $monto = isset($post['monto']) ? floatval($post['monto']) : null;
    $estado = isset($post['estado']) ? $mysqli->real_escape_string($post['estado']) : null;
    $detalles = isset($post['detalles']) ? $mysqli->real_escape_string($post['detalles']) : null;

    if (!$id_negociacion || !$tipo_pago || !$monto || !$estado) {
        echo json_encode(['estado' => false, 'mensaje' => 'Datos incompletos']);
        exit;
    }

    $stmt = $mysqli->prepare("UPDATE negociaciones SET 
                             tipo_pago = ?, 
                             monto = ?, 
                             estado = ?, 
                             detalles = ?,
                             fecha_negociacion = NOW()
                             WHERE id_negociacion = ?");
    $stmt->bind_param("sdsss", $tipo_pago, $monto, $estado, $detalles, $id_negociacion);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Negociación actualizada']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al actualizar']);
    }
    exit;
}

elseif ($post['accion'] == "actualizarEstadoCita") {
    $id_cita = isset($post['id_cita']) ? $mysqli->real_escape_string($post['id_cita']) : null;
    $estado = isset($post['estado']) ? $mysqli->real_escape_string($post['estado']) : null;

    if (!$id_cita || !$estado) {
        echo json_encode(['estado' => false, 'mensaje' => 'Datos incompletos']);
        exit;
    }

    $stmt = $mysqli->prepare("UPDATE citas SET estado = ? WHERE id_cita = ?");
    $stmt->bind_param("ss", $estado, $id_cita);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Estado actualizado']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al actualizar']);
    }
    exit;
}

elseif ($post['accion'] == "buscarNegociacion2") {
    $id_cita = isset($post['id_cita']) ? $mysqli->real_escape_string($post['id_cita']) : null;

    if (!$id_cita) {
        echo json_encode(['estado' => false, 'mensaje' => 'ID de cita no proporcionado']);
        exit;
    }

    $stmt = $mysqli->prepare("SELECT id_negociacion FROM negociaciones WHERE id_cita = ?");
    $stmt->bind_param("s", $id_cita);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $negociacion = $result->fetch_assoc();
        echo json_encode(['estado' => true, 'negociacion' => $negociacion]);
    } else {
        echo json_encode(['estado' => false]);
    }
    exit;
}

elseif ($post['accion'] == "eliminarNegociacion") {
    $id_negociacion = isset($post['id_negociacion']) ? $mysqli->real_escape_string($post['id_negociacion']) : null;

    if (!$id_negociacion) {
        echo json_encode(['estado' => false, 'mensaje' => 'ID de negociación no proporcionado']);
        exit;
    }

    $stmt = $mysqli->prepare("DELETE FROM negociaciones WHERE id_negociacion = ?");
    $stmt->bind_param("s", $id_negociacion);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Negociación eliminada']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al eliminar negociación']);
    }
    exit;
}

elseif ($post['accion'] == "obtenerIdCasaDeCita") {
    $id_cita = isset($post['id_cita']) ? $mysqli->real_escape_string($post['id_cita']) : null;

    $stmt = $mysqli->prepare("SELECT id_casa FROM citas WHERE id_cita = ?");
    $stmt->bind_param("s", $id_cita);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['estado' => true, 'id_casa' => $row['id_casa']]);
    } else {
        echo json_encode(['estado' => false]);
    }
    exit;
}

elseif ($post['accion'] == "actualizarEstadoCasa") {
    $id_casa = isset($post['id_casa']) ? $mysqli->real_escape_string($post['id_casa']) : null;
    $estado = isset($post['estado']) ? $mysqli->real_escape_string($post['estado']) : null;

    if (!$id_casa || !$estado) {
        echo json_encode(['estado' => false, 'mensaje' => 'Datos incompletos']);
        exit;
    }

    $stmt = $mysqli->prepare("UPDATE casas SET estado = ? WHERE id_casa = ?");
    $stmt->bind_param("ss", $estado, $id_casa);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Estado de casa actualizado']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al actualizar']);
    }
    exit;
}

if ($post['accion'] == "cargarUsuarios") {
    $busqueda = isset($post['busqueda']) ? $mysqli->real_escape_string($post['busqueda']) : '';
    $rol = isset($post['rol']) ? $mysqli->real_escape_string($post['rol']) : '';

    $where = "WHERE 1=1";
    if (!empty($busqueda)) {
        $where .= " AND (u.nombres_completos LIKE '%$busqueda%' OR u.email LIKE '%$busqueda%')";
    }
    if (!empty($rol)) {
        $where .= " AND u.id_rol = '$rol'";
    }

    $query = "SELECT 
                u.id_usuario, 
                u.nombres_completos, 
                u.direccion, 
                u.telefono, 
                u.id_rol,
                u.email,
                r.nombre_rol
              FROM usuarios u
              JOIN roles r ON u.id_rol = r.id_rol
              $where
              ORDER BY u.nombres_completos";

    $result = $mysqli->query($query);

    if ($result->num_rows > 0) {
        $usuarios = array();
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }
        echo json_encode(['estado' => true, 'usuarios' => $usuarios]);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'No se encontraron usuarios']);
    }
    exit;
}

elseif ($post['accion'] == "cargarRoles") {
    $query = "SELECT id_rol, nombre_rol FROM roles ORDER BY nombre_rol";
    $result = $mysqli->query($query);

    if ($result->num_rows > 0) {
        $roles = array();
        while ($row = $result->fetch_assoc()) {
            $roles[] = $row;
        }
        echo json_encode(['estado' => true, 'roles' => $roles]);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'No se encontraron roles']);
    }
    exit;
}

elseif ($post['accion'] == "crearUsuario") {
    $usuario = $post['usuario'];
    
    // Validar campos requeridos
    if (empty($usuario['nombres_completos']) || empty($usuario['email']) || empty($usuario['id_rol'])) {
        echo json_encode(['estado' => false, 'mensaje' => 'Campos requeridos faltantes']);
        exit;
    }

    // Asignar valores a variables
    $nombres = $mysqli->real_escape_string($usuario['nombres_completos']);
    $direccion = $mysqli->real_escape_string($usuario['direccion']);
    $telefono = $mysqli->real_escape_string($usuario['telefono']);
    $id_rol = $mysqli->real_escape_string($usuario['id_rol']);
    $email = $mysqli->real_escape_string($usuario['email']);
    
    // Encriptar contraseña si se proporcionó
    $contrasena_hash = !empty($usuario['contrasena']) ? password_hash($usuario['contrasena'], PASSWORD_DEFAULT) : '';

    $stmt = $mysqli->prepare("INSERT INTO usuarios (
                                nombres_completos, 
                                direccion, 
                                telefono, 
                                id_rol, 
                                email, 
                                contrasena
                              ) VALUES (?, ?, ?, ?, ?, ?)");
    
    // Pasar variables en lugar de valores directos
    $stmt->bind_param("ssssss", $nombres, $direccion, $telefono, $id_rol, $email, $contrasena_hash);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Usuario creado correctamente']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al crear usuario: ' . $mysqli->error]);
    }
    exit;
}
elseif ($post['accion'] == "actualizarUsuario") {
    $usuario = $post['usuario'];
    
    // Validar campos requeridos
    if (empty($usuario['id_usuario']) || empty($usuario['nombres_completos']) || empty($usuario['email']) || empty($usuario['id_rol'])) {
        echo json_encode(['estado' => false, 'mensaje' => 'Campos requeridos faltantes']);
        exit;
    }

    // Asignar valores a variables
    $id_usuario = $mysqli->real_escape_string($usuario['id_usuario']);
    $nombres = $mysqli->real_escape_string($usuario['nombres_completos']);
    $direccion = $mysqli->real_escape_string($usuario['direccion']);
    $telefono = $mysqli->real_escape_string($usuario['telefono']);
    $id_rol = $mysqli->real_escape_string($usuario['id_rol']);
    $email = $mysqli->real_escape_string($usuario['email']);

    // Preparar la consulta de actualización
    if (!empty($usuario['contrasena'])) {
        $contrasena_hash = password_hash($usuario['contrasena'], PASSWORD_DEFAULT);
        $query = "UPDATE usuarios SET 
                    nombres_completos = ?, 
                    direccion = ?, 
                    telefono = ?, 
                    id_rol = ?, 
                    email = ?, 
                    contrasena = ?
                  WHERE id_usuario = ?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("sssssss", $nombres, $direccion, $telefono, $id_rol, $email, $contrasena_hash, $id_usuario);
    } else {
        $query = "UPDATE usuarios SET 
                    nombres_completos = ?, 
                    direccion = ?, 
                    telefono = ?, 
                    id_rol = ?, 
                    email = ?
                  WHERE id_usuario = ?";
        $stmt = $mysqli->prepare($query);
        $stmt->bind_param("ssssss", $nombres, $direccion, $telefono, $id_rol, $email, $id_usuario);
    }

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Usuario actualizado correctamente']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al actualizar usuario: ' . $mysqli->error]);
    }
    exit;
}


elseif ($post['accion'] == "eliminarUsuario") {
    $id = isset($post['id']) ? $mysqli->real_escape_string($post['id']) : null;
    
    if (!$id) {
        echo json_encode(['estado' => false, 'mensaje' => 'ID no proporcionado']);
        exit;
    }

    $stmt = $mysqli->prepare("DELETE FROM usuarios WHERE id_usuario = ?");
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        echo json_encode(['estado' => true, 'mensaje' => 'Usuario eliminado correctamente']);
    } else {
        echo json_encode(['estado' => false, 'mensaje' => 'Error al eliminar usuario']);
    }
    exit;
}




