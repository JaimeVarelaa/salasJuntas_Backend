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

INSERT INTO usuarios (Nombre, ApellidoP, ApellidoM, Puesto, Foto) VALUES 
('Juan', 'González', 'López', 'Jefe','iusuarios/face1.png'),
('María', 'Rodríguez', 'Martínez', 'Supervisor','iusuarios/face2.png'),
('Pedro', 'Sánchez', 'Gómez', 'Empleado','iusuarios/face3.png'),
('Laura', 'Pérez', 'García', 'Jefe','iusuarios/default.png');

INSERT INTO salas (Nombre, Foto) VALUES 
('Sala A','isalas/boardroom1.png'),
('Sala B','isalas/boardroom2.png'),
('Sala C','isalas/boardroom3.png'),
('Sala D','isalas/boardroom4.png');

INSERT INTO reservacion (id_usuario, id_sala, Estado, Fecha, HoraInicio, HoraFinal) VALUES 
(1, 1, 'Pendiente', '2023-12-19', '09:00:00', '11:00:00'),
(2, 2, 'Pendiente', '2023-12-19', '10:00:00', '12:00:00'),
(3, 3, 'Pendiente', '2023-12-19', '11:00:00', '13:00:00'),
(4, 4, 'Pendiente', '2023-12-19', '14:00:00', '16:00:00');
