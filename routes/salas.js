const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const con = require('../database');

const router = express.Router();

//guardar las imágenes con multer
router.use('/isalas', express.static(path.join(__dirname, 'isalas')));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'isalas');
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
            Foto: file ? file.path : "isalas/default.png",
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
router.put('/:id', upload.single('file'), (req, res) => {
    const id = req.params.id;
    const nombre = req.body.nombre;
    const file = req.file;

    const sala = {
        Nombre: nombre,
        Foto: file ? file.path : "isalas/default.png",
    };
    //verificar si existe la sala
    con.query('SELECT * FROM salas WHERE id = ?', id, (error, rows, fields) => {
        if (!error && rows.length > 0) {
            con.query('UPDATE salas SET ? WHERE id = ?', [sala, id], (error, results) => {
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

//eliminar una sala
router.delete('/:id', (req, res) => {
    const idSala = req.params.id;

    //obtener reservaciones en esa sal
    con.query('SELECT * FROM reservacion WHERE id_sala = ?', idSala, (error, reservaciones, fields) => {
        if (!error) {
            //eliminar las reservaciones
            if (reservaciones.length > 0) {
                const idsReservaciones = reservaciones.map(reservacion => reservacion.id);
                con.query('DELETE FROM reservacion WHERE id IN (?)', [idsReservaciones], (errorReservaciones, resultsReservaciones) => {
                    if (!errorReservaciones) {
                        //eliminar la sala
                        con.query('DELETE FROM salas WHERE id = ?', idSala, (errorSala, resultsSala) => {
                            if (!errorSala) {
                                res.send({ success: true, message: 'Sala y reservaciones eliminadas.' });
                            } else {
                                console.log('Error al eliminar sala: ' + errorSala);
                                res.send({ success: false, message: 'Error al eliminar sala.' });
                            }
                        });
                    } else {
                        console.log('Error al eliminar las reservaciones');
                        res.send({ success: false, message: 'Error al eliminar las reservaciones.' });
                    }
                });
            } else {
                //en caso de no haber reservaciones borramos la sala
                con.query('DELETE FROM salas WHERE id = ?', idSala, (errorSala, resultsSala) => {
                    if (!errorSala) {
                        res.send({ success: true, message: 'Sala eliminada.' });
                    } else {
                        console.log('Error al eliminar sala: ' + errorSala);
                        res.send({ success: false, message: 'Error al eliminar sala.' });
                    }
                });
            }
        } else {
            console.log('Error al obtener los datos');
            res.send({ success: false, message: 'Error al obtener los datos.' });
        }
    });
});


module.exports = router;