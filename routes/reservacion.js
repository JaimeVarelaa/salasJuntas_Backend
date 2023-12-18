const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const con = require('../database');

const router = express.Router();

//crear reservación
router.post('', (req, res, next) => {
    const usuario = req.body.usuario;
    const sala = req.body.sala;
    const Estado = req.body.Estado;;
    const Fecha = req.body.Fecha;
    const HoraInicio = req.body.HoraInicio;
    const HoraFinal = req.body.HoraFinal;

    const reservacion = {
        id: null,
        id_usuario: usuario,
        id_sala: sala,
        Estado: Estado,
        Fecha: Fecha,
        HoraInicio: HoraInicio,
        HoraFinal: HoraFinal,
    };

    con.query('INSERT INTO reservacion SET ?', [reservacion], (error, results) => {
        if (!error) {
            res.send({ success: true, message: 'Reservación creada exitosamente.' });
        } else {
            console.log("Error al crear la reservación.")
            res.send("Error al crear la reservación." + error + reservacion);
        }
    });
});

//obtener todos las reservaciones con nombre de sala y usuario que están pendiente
router.get('/p', (req, res) => {
    con.query('SELECT r.id, u.nombre as usuario, s.nombre as sala, r.estado, r.fecha, r.horainicio, r.horafinal FROM usuarios u, salas s, reservacion r WHERE r.id_usuario = u.id AND r.id_sala = s.id AND r.estado = "Pendiente"', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos' + error);
        }
    })
});

//obtener todos las reservaciones con nombre de sala y usuario que están completado
router.get('/c', (req, res) => {
    con.query('SELECT r.id, u.nombre as usuario, s.nombre as sala, r.estado, r.fecha, r.horainicio, r.horafinal FROM usuarios u, salas s, reservacion r WHERE r.id_usuario = u.id AND r.id_sala = s.id AND r.estado = "Completado"', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos' + error);
        }
    })
});

//obtener todos las reservaciones con nombre de sala y usuario que están cancelado
router.get('/x', (req, res) => {
    con.query('SELECT r.id, u.nombre as usuario, s.nombre as sala, r.estado, r.fecha, r.horainicio, r.horafinal FROM usuarios u, salas s, reservacion r WHERE r.id_usuario = u.id AND r.id_sala = s.id AND r.estado = "Cancelado"', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos' + error);
        }
    })
});

//obtener todos las reservaciones con nombre de sala y usuario
router.get('', (req, res) => {
    con.query('SELECT r.id, u.nombre as usuario, s.nombre as sala, r.estado, r.fecha, r.horainicio, r.horafinal FROM usuarios u, salas s, reservacion r WHERE r.id_usuario = u.id AND r.id_sala = s.id', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos' + error);
        }
    })
});

//obtener sólo una reservación
router.get('/:id', (req, res) => {
    const id = req.params.id;
    con.query('SELECT r.id, u.nombre as usuario, s.nombre as sala, r.estado, r.fecha, r.horainicio, r.horafinal FROM usuarios u, salas s, reservacion r WHERE r.id_usuario = u.id AND r.id_sala = s.id AND r.id = ?', [id], (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log('Error al obtener los datos' + error);
        }
    })
});

//actualizar datos de la reservación
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const usuario = req.body.usuario;
    const sala = req.body.sala;
    const Estado = req.body.Estado;;
    const Fecha = req.body.Fecha;
    const HoraInicio = req.body.HoraInicio;
    const HoraFinal = req.body.HoraFinal;

    const reservacionAct = {
        id: id,
        id_usuario: usuario,
        id_sala: sala,
        Estado: Estado,
        Fecha: Fecha,
        HoraInicio: HoraInicio,
        HoraFinal: HoraFinal,
    };
    //verificar si existe la reservación
    con.query('SELECT * FROM reservacion WHERE id = ?', id, (error, rows, fields) => {
        if (!error && rows.length > 0) {
            con.query('UPDATE reservacion SET ? WHERE id = ?', [reservacionAct, id], (error, results) => {
                if (!error) {
                    res.send({ success: true, message: 'Reservación actualizado exitosamente.' });
                } else {
                    console.log('Error al actualizar.');
                    res.send("Error al actualizar." + error)
                }
            });
        } else {
            console.log('Error al actualizar, reservación no existe.');
            res.send({ success: false, message: 'Error al actualizar, reservación no existe.' })
        }
    });
});

//eliminar una reservación
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    //verificar si existe la reservación
    con.query('SELECT * FROM reservacion WHERE id = ?', id, (error, rows, fields) => {
        if (!error && rows.length > 0) {
            con.query('DELETE FROM reservacion WHERE id = ?', id, (error, results) => {
                if (!error) {
                    res.send({ success: true, message: 'Reservación eliminada exitosamente.' });
                } else {
                    console.log('Error al eliminar' + error);
                }
            });
        } else {
            console.log('Error al eliminar, reservación no existe.');
            res.send({ success: false, message: 'Error al eliminar, reservación no existe.' })
        }
    });
});


//cambiar reservaciones de pendiente a completado en función de horafinal
const completarReserv = () => {
    const now = new Date();
    con.query('UPDATE reservacion SET estado = "Completado" WHERE estado = "Pendiente" AND HoraFinal <= ?', [now], (error, results) => {
        if (!error) {
            //console.log('Cambio a completado');
        } else {
            console.log('Error al completar.');
        }
        setTimeout(completarReserv, 60000);
    });
};
//llamar la función
completarReserv();



module.exports = router;
