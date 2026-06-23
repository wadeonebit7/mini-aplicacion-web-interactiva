const mysql = require("mysql2");

const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: 'aplicacion_interactiva'
});
connection.connect(function (err) {
    if (err) {
        console.log('Error connection:' + err.stack);
    }
    console.log('connected successfully to DB')
})

module.exports = connection;