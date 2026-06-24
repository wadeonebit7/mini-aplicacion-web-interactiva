# Mosearch - Aplicación Interactiva

Aplicación web interactiva sobre peliculas online con sistema de autenticación de usuarios (registro y login) acoplado a una base de datos relacional y un foro de criticas en la página principal con validación avanzada en el cliente.

## Tecnologías

- **Frontend:** HTML5, CSS, JavaScript (Manipulación de nodos del DOM y Eventos)
- **Backend:** Node.js, Express.js, Express-session (Manejo de sesiones activas)
- **Base de datos:** MySQL (Persistencia relacional)
- **Seguridad:** Encriptación de contraseñas con Bcrypt

## Requisitos previos

- Node.js v18 o superior
- Servidor MySQL local activo (Laragon, XAMPP o Workbench)

## Instalación


1. Clona el repositorio e instala las dependencias:

```bash
git clone <url-del-repositorio>
cd mosearch-interactivo
npm install
```

2. Crea la base de datos en MySQL:

```sql
CREATE DATABASE IF NOT EXISTS aplicacion_interactiva;
USE aplicacion_interactiva;

CREATE TABLE IF NOT EXISTS usuarios (
    id int PRIMARY KEY AUTO_INCREMENT,
    username varchar(255) UNIQUE NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE IF NOT EXISTS comentarios_peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    contenido TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Configura la conexión en `db.js` si tu MySQL usa usuario o contraseña distintos:

```javascript
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",      // tu usuario
    password: "",      // tu contraseña
    database: "aplicacion_interactiva"
});
```

4. Inicia el servidor:

```bash
node app.js
```

5. Abre el navegador en `http://localhost:3000`

## Estructura del proyecto

```
├── public/
│   ├── css/
│   │   ├── styles.css
│   │   └── styles-movie.css
│   ├── img/
│   │   ├── edge_of_tomorrow.jpg
│   │   ├── pasajeros.jpg
│   │   └── la_guerra_del_mañana.jpg
│   ├── js/
│   │   ├── movie-behavior.js
│   │   └── script.js
│   ├── media/
│   │   ├── edge_of_tomorrow.mp4
│   │   ├── pasajeros.mp4
│   │   └── la_guerra_del_mañana.mp4
│   ├── index.html
│   ├── login.html
│   └── register.html
├── app.js
├── db.js
├── package.json
├── package-lock.json
└── README.md
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/register` | Registra una nueva cuenta hasheando la clave antes de insertarla |
| `POST` | `/login` | Autentica al usuario y crea una sesión segura en el servidor |
| `POST` | `/check-availability` | Valida asíncronamente si el correo o usuario ya se encuentran registrados |
| `POST` | `/comentarios` | Recibe, procesa e inserta una nueva opinión de película en la BD |
| `GET` | `/comentarios` | Recupera el listado completo de reseñas en orden cronológico inverso |

## Funcionalidades

- Bloqueo de envíos vacíos por deshabilitación del boton
- Alertas rojas en tiempo real cuando un campo no cumple los requisitos.
- Control estricto mediante expresiones regulares
- Verificación de que el nombre del usuario supere el límite mínimo seguro.
- Validación de que el campo de contenido sea lo suficientemente extenso.
- Carga del último comentario registrado con un clic
- Uso de preventDefault() para controlar los campos de texto antes de permitir pasar por el backend.