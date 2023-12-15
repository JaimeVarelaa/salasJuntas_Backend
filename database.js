const mysql = require('mysql');

//crear conexión con la base de datos local
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'salasJuntas',
    multipleStatements: true,
})

//conectar con la base de datos local
con.connect(function(error){
    if(error){
        console.log(error);
        return;
    } else {
        console.log('Conectado con la base de datos');
    }
})

module.exports = con;