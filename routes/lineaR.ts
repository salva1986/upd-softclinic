import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as lineaC from '../controllers/lineaC';

const lineaRoutes = Router();


//lineaRoutes.get('/', [ verificaToken ], lineaC.obtenerLinea);

lineaRoutes.get('/get/:estado', [ verificaToken ], lineaC.verTodos);
lineaRoutes.put('/update/:id', [ verificaToken ],  lineaC.actualizarLinea);
lineaRoutes.put('/delete/:id', [ verificaToken ],  lineaC.eliminarLinea);
lineaRoutes.put('/deleteselected/:filtro', [ verificaToken ],  lineaC.eliminarLineas);


export default lineaRoutes;
