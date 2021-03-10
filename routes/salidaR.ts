import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as salidaC from '../controllers/salidaC';

const salidaRoutes = Router();


salidaRoutes.get('/', [ verificaToken ], salidaC.obtenerSalida);

salidaRoutes.get('/get/:estado', [ verificaToken ], salidaC.verTodos);
salidaRoutes.put('/update/:id', [ verificaToken ],  salidaC.actualizarSalida);
salidaRoutes.put('/delete/:id', [ verificaToken ], salidaC.eliminarSalida);
salidaRoutes.put('/deleteselected/:filtro', [ verificaToken ],  salidaC.eliminarSalidas);


export default salidaRoutes;
