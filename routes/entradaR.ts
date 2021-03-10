import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as entradaC from '../controllers/entradaC';

const entradaRoutes = Router();


//entradaRoutes.get('/', entradaC.obtenerEntrada);

entradaRoutes.get('/get/:estado', [ verificaToken ], entradaC.verTodos);
entradaRoutes.post('/create/:id', [ verificaToken ], entradaC.actualizarEntrada);
entradaRoutes.put('/delete/:id', [ verificaToken ], entradaC.eliminarEntrada);
entradaRoutes.put('/deleteselected/:filtro', [ verificaToken ],  entradaC.eliminarEntradas);

export default entradaRoutes;