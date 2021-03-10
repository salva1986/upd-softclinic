import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as bodegaC from '../controllers/bodegaC';

const bodegaRoutes = Router();


bodegaRoutes.get('/', [ verificaToken ], bodegaC.obtenerBodega);

bodegaRoutes.get('/get/:estado',  [ verificaToken ], bodegaC.verTodos);
bodegaRoutes.put('/update/:id',  [ verificaToken ],  bodegaC.actualizarBodega);
bodegaRoutes.put('/delete/:id',   [ verificaToken ], bodegaC.eliminarBodega);
bodegaRoutes.put('/deleteselected/:filtro',   [ verificaToken ], bodegaC.eliminarBodegas);


export default bodegaRoutes;
