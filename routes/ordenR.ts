import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as ordenC from '../controllers/ordenC';

const ordenRoutes = Router();


ordenRoutes.get('/', [ verificaToken ], ordenC.obtenerOrden);

ordenRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ], ordenC.verTodos);
ordenRoutes.put('/update/:id', [ verificaToken ], ordenC.actualizarOrden);
ordenRoutes.put('/delete/:id', [ verificaToken ],  ordenC.eliminarOrden);
ordenRoutes.put('/deleteselected/:filtro', [ verificaToken ], ordenC.eliminarOrdenes);


export default ordenRoutes;
