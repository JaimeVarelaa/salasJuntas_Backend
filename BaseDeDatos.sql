CREATE DATABASE IF NOT EXISTS salasJuntas;
USE salasJuntas;

-- Tabla para usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(25) NOT NULL,
    ApellidoP VARCHAR(25) NOT NULL,
    ApellidoM VARCHAR(25) NOT NULL,
    Puesto ENUM('Jefe', 'Supervisor', 'Empleado') NOT NULL,
    Foto varchar(255) DEFAULT ('fotos/default.png"')
);

-- Tabla para salas de juntas
CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(25) NOT NULL,
    Foto varchar(255) DEFAULT ('salas/default.png')
);

-- Tabla de préstamo de salas
CREATE TABLE IF NOT EXISTS reservacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_sala INT,
    Estado ENUM('Cancelado','Pendiente','Completado') NOT NULL,
    Fecha DATE NOT NULL,
    HoraInicio TIME NOT NULL,
    HoraFinal TIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_sala) REFERENCES salas(id)
);