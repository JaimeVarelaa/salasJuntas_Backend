const express = require('express');
const cors = require('cors');
//registro de solicitudes
const morgan = require('morgan');

const salaRoutes = require('./routes/salas');
const usuarioRoutes = require('./routes/usuarios');
const reservacionRoutes = require('./routes/reservacion');

const app = express();
//permitir solicitudes desde cualquier lado
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

//uso de rutas de salas
app.use('/salas', salaRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/reservacion', reservacionRoutes);

//ver las imagenes
app.use('/isalas', express.static('isalas'));
app.use('/iusuarios', express.static('iusuarios'));


app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});