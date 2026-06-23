
CREATE DATABASE IF NOT EXISTS aplicacion_interactiva;
USE aplicacion_interactiva;

CREATE TABLE IF NOT EXISTS usuarios (
    id int PRIMARY KEY AUTO_INCREMENT,
    username varchar(255) UNIQUE NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL
)