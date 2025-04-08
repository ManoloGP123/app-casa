-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-04-2025 a las 21:09:52
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `inmobiliaria_db`
--
CREATE DATABASE IF NOT EXISTS `inmobiliaria_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `inmobiliaria_db`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `casas`
--

DROP TABLE IF EXISTS `casas`;
CREATE TABLE `casas` (
  `id_casa` int(11) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `precio` decimal(12,2) NOT NULL,
  `dimensiones` varchar(50) DEFAULT NULL,
  `habitaciones` int(11) DEFAULT NULL,
  `banos` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'disponible',
  `provincia` varchar(100) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `imagen` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `casas`:
--

--
-- Volcado de datos para la tabla `casas`
--

INSERT INTO `casas` (`id_casa`, `direccion`, `precio`, `dimensiones`, `habitaciones`, `banos`, `descripcion`, `estado`, `provincia`, `ciudad`, `imagen`) VALUES
(1, 'Calle 5 y 7', 10.00, '12', 5, 2, 'Ninguna', 'Disponible', 'Pichincha', 'Quito', '...'),
(2, 'Calle 3 y 4', 1000.00, '12', 1, 1, 'as', 'Reservado', 'Guayas', 'Guayaquil', '...'),
(3, 'Calle 1 y calle 2', 2000.00, '22', 2, 1, 'Ninguna', 'Disponible', 'Guayas', 'Guayaquil', '...');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

DROP TABLE IF EXISTS `citas`;
CREATE TABLE `citas` (
  `id_cita` int(11) NOT NULL,
  `id_casa` int(11) NOT NULL,
  `id_asesor` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` varchar(20) DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `citas`:
--   `id_casa`
--       `casas` -> `id_casa`
--   `id_asesor`
--       `usuarios` -> `id_usuario`
--   `id_cliente`
--       `usuarios` -> `id_usuario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negociaciones`
--

DROP TABLE IF EXISTS `negociaciones`;
CREATE TABLE `negociaciones` (
  `id_negociacion` int(11) NOT NULL,
  `id_cita` int(11) NOT NULL,
  `tipo_pago` varchar(20) NOT NULL,
  `monto` decimal(12,2) NOT NULL,
  `fecha_negociacion` datetime DEFAULT current_timestamp(),
  `estado` varchar(20) DEFAULT 'en_proceso',
  `detalles` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `negociaciones`:
--   `id_cita`
--       `citas` -> `id_cita`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre_rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `roles`:
--

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre_rol`) VALUES
(1, 'Administrador'),
(2, 'Asesor'),
(3, 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombres_completos` varchar(100) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELACIONES PARA LA TABLA `usuarios`:
--   `id_rol`
--       `roles` -> `id_rol`
--

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombres_completos`, `direccion`, `telefono`, `id_rol`, `email`, `contrasena`) VALUES
(1, 'Kevin', 'Riobamba', '098272344', 1, 'kevinsan16@gmail.com', '123'),
(2, 'Cliente1', 'Rio', '123', 3, 'asd@g.com', '123'),
(3, 'asesor1', 'asd', '123', 2, 'rr@g.com', '123'),
(4, 'asesor2', 'asd', '123', 2, 'a@g.com', '123');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `casas`
--
ALTER TABLE `casas`
  ADD PRIMARY KEY (`id_casa`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id_cita`),
  ADD KEY `id_casa` (`id_casa`),
  ADD KEY `id_asesor` (`id_asesor`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `negociaciones`
--
ALTER TABLE `negociaciones`
  ADD PRIMARY KEY (`id_negociacion`),
  ADD KEY `id_cita` (`id_cita`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `casas`
--
ALTER TABLE `casas`
  MODIFY `id_casa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id_cita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `negociaciones`
--
ALTER TABLE `negociaciones`
  MODIFY `id_negociacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`id_casa`) REFERENCES `casas` (`id_casa`),
  ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`id_asesor`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `negociaciones`
--
ALTER TABLE `negociaciones`
  ADD CONSTRAINT `negociaciones_ibfk_1` FOREIGN KEY (`id_cita`) REFERENCES `citas` (`id_cita`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
