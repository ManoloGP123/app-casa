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

    $sentencia = sprintf("
        SELECT 
            u.id_usuario, 
            u.nombres_completos, 
            u.id_rol,
            r.nombre_rol
        FROM 
            usuarios u
        INNER JOIN 
            roles r ON u.id_rol = r.id_rol
        WHERE 
            u.email = '%s' AND 
            u.contrasena = '%s'",
        mysqli_real_escape_string($mysqli, $email),
        mysqli_real_escape_string($mysqli, $contrasena));
    
    $result = mysqli_query($mysqli, $sentencia);

    if (mysqli_num_rows($result) > 0) {
        $usuario = mysqli_fetch_assoc($result);
        
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
        $respuesta = array(
            'estado' => false,
            'mensaje' => 'Credenciales incorrectas'
        );
    }

    echo json_encode($respuesta);
}

// Cargar todas las casas con filtros
if ($post['accion'] == "cargarCasas") {
    $provincia = isset($post['provincia']) ? $post['provincia'] : '';
    $ciudad = isset($post['ciudad']) ? $post['ciudad'] : '';
    $estado = isset($post['estado']) ? $post['estado'] : '';

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
}

// Cargar datos de una casa específica
elseif ($post['accion'] == "cargarCasa") {
    $id = $post['id'];

    $sentencia = sprintf("SELECT 
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
                          WHERE id_casa = '%s'",
                          mysqli_real_escape_string($mysqli, $id));

    $result = mysqli_query($mysqli, $sentencia);

    if (mysqli_num_rows($result) > 0) {
        $casa = mysqli_fetch_assoc($result);
        $respuesta = array('estado' => true, 'casa' => $casa);
    } else {
        $respuesta = array('estado' => false, 'mensaje' => 'Casa no encontrada');
    }
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

// Obtener ciudades por provincia
elseif ($post['accion'] == "obtenerCiudades") {
    $provincia = $post['provincia'];

    $sentencia = sprintf("SELECT DISTINCT ciudad FROM casas WHERE provincia = '%s' ORDER BY ciudad",
                          mysqli_real_escape_string($mysqli, $provincia));

    $result = mysqli_query($mysqli, $sentencia);

    if (mysqli_num_rows($result) > 0) {
        $ciudades = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $ciudades[] = $row['ciudad'];
        }
        $respuesta = array('estado' => true, 'ciudades' => $ciudades);
    } else {
        $respuesta = array('estado' => false, 'mensaje' => 'No se encontraron ciudades para esta provincia');
    }
}

echo json_encode($respuesta);





