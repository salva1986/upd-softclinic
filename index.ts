// Dependencies
import fs from 'fs';
import http from 'http';
import https from 'https';
import express from 'express';
import Server from './classes/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import userRoutes from './routes/usuarioR';
import pacienteRoutes from './routes/pacienteR';
import productoRoutes from './routes/productoR';
import proveedorRoutes from './routes/proveedorR';
import servicioRoutes from './routes/servicioR';
import presentacionRoutes from './routes/presentacionR';
import entradaRoutes from './routes/entradaR';
import postRoutes from './routes/postR';
import rolRoutes from './routes/rolR';
import registroPacienteRoutes from './routes/registroPacienteR';
import pedidoRoutes from './routes/pedidoR';
import facturaRoutes from './routes/facturaR';
import citaRoutes from './routes/citaR';
import farmaciaRoutes from './routes/farmaciaR';
import consumibleRoutes from './routes/consumibleR';
import insumoRoutes from './routes/insumoR';
import ortopodologiaRoutes from './routes/ortopodologiaR';

import cors from 'cors';
import bodegaRoutes from './routes/bodegaR';
import salidaRoutes from './routes/salidaR';
import casaRoutes from './routes/casaR';
import lineaRoutes from './routes/lineaR';
import ordenRoutes from './routes/ordenR';
import requisicionRoutes from './routes/requisicionR';
import kardexRoutes from './routes/kardexR';
import reporteRoutes from './routes/reporteR';


const app = express();

// Body parser
app.use( bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json() );
// FileUpload
app.use( fileUpload({ useTempFiles: true }) );
// //Configurar CORS
app.use(cors({origin: true, credentials: true}));
// Rutas
// Admin
app.use('/user', userRoutes );
app.use('/paciente', pacienteRoutes );
app.use('/rol', rolRoutes );
app.use('/producto', productoRoutes );
app.use('/proveedor', proveedorRoutes );
app.use('/servicio', servicioRoutes );
app.use('/presentacion', presentacionRoutes );
app.use('/registropaciente', registroPacienteRoutes );
app.use('/casa', casaRoutes );
app.use('/linea', lineaRoutes );

// Recepción
app.use('/cita', citaRoutes );

// Inventario
app.use('/orden', ordenRoutes)
app.use('/pedido', pedidoRoutes);
app.use('/bodega', bodegaRoutes);
app.use('/salida', salidaRoutes);
app.use('/farmacia', farmaciaRoutes);
app.use('/consumible', consumibleRoutes);
app.use('/insumo', insumoRoutes);
app.use('/ortopodologia', ortopodologiaRoutes);


app.use('/posts', postRoutes );
app.use('/entrada', entradaRoutes );
app.use('/factura', facturaRoutes );
app.use('/requisicion', requisicionRoutes );
app.use('/kardex', kardexRoutes );
app.use('/reporte', reporteRoutes );


// // Conectar DB
mongoose.connect('mongodb://localhost:27017/upd-softclinicdb', 
                 { useNewUrlParser: true, useCreateIndex: true }, ( err ) => {
    if ( err ) throw err;
    console.log('Base de datos MONGO ONLINE');
})

// Starting both http & https servers
const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT || 3000, () => {
	console.log('HTTP Server corriendo en puerto 3000 only HTTP');
});