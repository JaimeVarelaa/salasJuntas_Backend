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
        const Nombre = req.body.nombre;

        const sala = {
            id: null,
            Nombre: Nombre,
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

module.exports = router;
