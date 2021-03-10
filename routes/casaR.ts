import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as casaC from '../controllers/casaC';

const casaRoutes = Router();


//casaRoutes.get('/', casaC.obtenerCasa);

casaRoutes.get('/get/:estado', [ verificaToken ],  casaC.verTodos);
casaRoutes.put('/update/:id', [ verificaToken ],  casaC.actualizarCasa);
casaRoutes.put('/delete/:id', [ verificaToken ],   casaC.eliminarCasa);
casaRoutes.put('/deleteselected/:filtro', [ verificaToken ],   casaC.eliminarCasas);


export default casaRoutes;
