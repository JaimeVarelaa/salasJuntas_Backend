const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const con = require('../database');

const router = express.Router();

//guardar las imágenes con multer
router.use('/usuarios', express.static(path.join(__dirname, 'usuarios')));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'usuarios');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

//crear usuario
router.post('', upload.single('file'), async (req, res, next) => {
    const file = req.file;
    const nombre = req.body.nombre;
    const apellidoP = req.body.ApellidoP;
    const apellidoM = req.body.ApellidoM;
    const puesto = req.body.Puesto;

    const usuario = {
        id: null,
        Nombre: nombre,
        ApellidoP: apellidoP,
        ApellidoM: apellidoM,
        Puesto: puesto,
        Foto: file ? file.path : "usuarios/default.png",
    };
    con.query('INSERT INTO usuarios SET ?', [usuario], (error, results) => {
        if (!error) {
            res.send({ success: true, message: 'Usuario creado exitosamente.' });
        } else {
            res.send({ success: false, message: 'Usuario no se pudo crear' })
        }
    });
});

//obtener todas los usuarios
router.get('', (req, res) => {
    con.query('SELECT * FROM usuarios', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos.');
        }
    })
});

//obtener sólo un usuario
router.get('/:id', (req, res) => {
    const id = req.params.id;
    con.query('SELECT * FROM usuarios WHERE id = ?', id, (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos.');
        }
    })
});

//actualizar datos de un usuario
router.put('/:id', upload.single('file'), (req, res) => {
    const id = req.params.id;
    const file = req.file;
    const nombre = req.body.nombre;
    const apellidoP = req.body.ApellidoP;
    const apellidoM = req.body.ApellidoM;
    const puesto = req.body.Puesto;

    const usuario = {
        Nombre: nombre,
        ApellidoP: apellidoP,
        ApellidoM: apellidoM,
        Puesto: puesto,
        Foto: file ? file.path : "usuarios/default.png",
    };
    //verificar si existe el usuario
    con.query('SELECT * FROM usuarios WHERE id = ?', id, (error, rows, fields) => {
        if (!error && rows.length > 0) {
            con.query('UPDATE usuarios SET ? WHERE id = ?', [usuario, id], (error, results) => {
                if (!error) {
                    res.send({ success: true, message: 'Usuario actualizada exitosamente.' });
                } else {
                    console.log('Error al actualizar.' + error);
                }
            });
        } else {
            console.log('Error al actualizar, usuario no existe.');
            res.send({ success: false, message: 'Error al actualizar, usuario no existe.' })
        }
    });
});

//eliminar un usuario
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    //verificar si existe el usuario
    con.query('SELECT * FROM usuarios WHERE id = ?', id, (error, rows, fields) => {
        if (!error && rows.length > 0) {
            con.query('DELETE FROM usuarios WHERE id = ?', id, (error, results) => {
                if (!error) {
                    res.send({ success: true, message: 'Usuario eliminada exitosamente.' });
                } else {
                    console.log('Error al eliminar');
                }
            });
        } else {
            console.log('Error al eliminar, usuario no existe.');
            res.send({ success: false, message: 'Error al eliminar, usuario no existe.' })
        }
    });
});

module.exports = router;
