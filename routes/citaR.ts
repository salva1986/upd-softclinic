import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as citaC from '../controllers/citaC';

const citaRoutes = Router();

citaRoutes.get('/getById/:id', [ verificaToken ],  citaC.verCitaById);
citaRoutes.get('/imprimirFEL/:uuid', [ verificaToken ],  citaC.imprimirFEL);
citaRoutes.get('/get/calendario/:fechaInicio/:fechaFin', [ verificaToken ], citaC.verCalendarioCitas);
citaRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ],  citaC.verTodos);
citaRoutes.put('/update/servicios/:id', [ verificaToken ],   citaC.actualizarCitaAgregarServicio);
citaRoutes.put('/delete/servicios/:idCita/:id', [ verificaToken ],   citaC.actualizarCitaEliminarServicio);
citaRoutes.put('/update/consumibles/:id', [ verificaToken ],   citaC.actualizarCitaAgregarConsumible);
citaRoutes.put('/delete/consumibles/:idCita/:id', [ verificaToken ],   citaC.actualizarCitaEliminarConsumible);
citaRoutes.put('/update/insumos/:id', [ verificaToken ],   citaC.actualizarCitaAgregarInsumo);
citaRoutes.put('/delete/insumos/:idCita/:id', [ verificaToken ],   citaC.actualizarCitaEliminarInsumo);
citaRoutes.put('/update/productos/:id', [ verificaToken ],   citaC.actualizarCitaAgregarProducto);
citaRoutes.put('/delete/productos/:idCita/:id', [ verificaToken ],   citaC.actualizarCitaEliminarProducto);
citaRoutes.put('/update/ortopodologia/:id', [ verificaToken ],   citaC.actualizarCitaAgregarOrtopodologia);
citaRoutes.put('/delete/ortopodologia/:idCita/:id', [ verificaToken ],   citaC.actualizarCitaEliminarOrtopodologia);
citaRoutes.put('/update/:id', [ verificaToken ],   citaC.actualizarCita);
citaRoutes.put('/delete/:id', [ verificaToken ],   citaC.eliminarCita);
citaRoutes.put('/deleteselected/:filtro', [ verificaToken ],   citaC.eliminarCitas);
citaRoutes.put('/guardarDatosFacturacion/:cita', [ verificaToken ],   citaC.guardarDatosFacturacion);
citaRoutes.post('/emitirNotaCredito/:cita', [ verificaToken ],   citaC.emitirNotaCredito);
citaRoutes.post('/emitirNotaDebito/:cita', [ verificaToken ],   citaC.emitirNotaDebito);
citaRoutes.put('/delete/anularFactura/:idCita', [ verificaToken ],   citaC.anularFactura);


export default citaRoutes;
