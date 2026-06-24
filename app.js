const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // Para hashear contraseñas
const session = require('express-session');
const connection = require('./db.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'SECRETO',
    resave: false,
    saveUninitialized: true, // mantener inactividad
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 30
    }
}))



// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM usuarios WHERE username = ?';

    connection.query(sql, [username], async(err, resultados) => {
        if(err){
            console.log(err);
            return res.status(500).send("Error en el servidor");
        }

        if(resultados.length > 0){
            const match = await bcrypt.compare(password, resultados[0].password);
            if(match) {
                req.session.usuario = resultados[0];
                return res.send("Inicio de sesión exitoso");
            }
        }
        res.send("Usuario o contraseña incorrectos");
    })
});



app.post('/check-availability', (req, res) => {
    const { type, value } = req.body;
    let query = '';
    if (type === 'username') {
        query = 'SELECT * FROM usuarios WHERE username = ?';
    } else if (type === 'email') {
        query = 'SELECT * FROM usuarios WHERE email = ?';
    }
    connection.query(query, [value], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ available: results.length === 0 });
    });
});





app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hashear la contraseña
    const query = 'INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)';
    connection.query(query, [username, email, hashedPassword], (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'Usuario o correo ya existente' });
            }
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});


app.post('/comentarios', (req, res) => {
    const { username, correo, titulo, contenido } = req.body;
    const query = 'INSERT INTO comentarios_peliculas (username, correo, titulo, contenido) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [username, correo, titulo, contenido], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true, id: result.insertId });
    });
});

app.get('/comentarios', (req, res) => {
    connection.query('SELECT * FROM comentarios_peliculas ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json([]);
        res.json(results);
    });
});





app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});