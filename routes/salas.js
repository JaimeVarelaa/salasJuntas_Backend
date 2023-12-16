const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const con = require('../database');

const router = express.Router();

//guardar las imágenes con multer
router.use('/salas', express.static(path.join(__dirname, 'salas')));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'salas');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

//crear sala
router.post('', upload.single('file'), async (req, res, next) => {
    try {
        const file = req.file;
        const nombre = req.body.nombre;

        const sala = {
            id: null,
            Nombre: nombre,
            Foto: file ? file.path : "salas/default.png",
        };

        con.query('INSERT INTO salas SET ?', [sala], (error, results) => {
            if (error) {
                throw error;
            }

            res.send({ success: true, message: 'Sala creada exitosamente.' });
        });
    } catch (error) {
        next(error);
    }
});

//obtener todas las salas
router.get('', (req, res) => {
    con.query('SELECT * FROM salas', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos' + error);
        }
    })
});

//obtener sólo una sala
router.get('/:id', (req, res) => {
    const id = req.params.id;
    con.query('SELECT * FROM salas WHERE id = ?', id, (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos' + error);
        }
    })
});

//actualizar datos de una sala

//actualizar datos de una sala
router.put('/:id', upload.single('file'), (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const file = req.file;

    const salaAct = {
        Nombre: nombre,
        Foto: file ? file.path : "salas/default.png",
    };
    //verificar si existe la sala
    con.query('SELECT * FROM salas WHERE id = ?', id, (error, rows, fields) => {
        if (!error && rows.length > 0) {
            con.query('UPDATE salas SET ? WHERE id = ?', [salaAct, id], (error, results) => {
                if (!error) {
                    res.send({ success: true, message: 'Sala actualizada exitosamente.' });
                } else {
                    console.log('Error al actualizar.');
                }
            });
        } else {
            console.log('Error al actualizar, sala no existe.');
            res.send({ success: false, message: 'Error al actualizar, sala no existe.' })
        }
    });

});

module.exports = router;
