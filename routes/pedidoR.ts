import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as pedidoC from '../controllers/pedidoC';

const pedidoRoutes = Router();


pedidoRoutes.get('/', [ verificaToken ], pedidoC.obtenerPedido);

pedidoRoutes.get('/get/:estado', [ verificaToken ], pedidoC.verTodos);
pedidoRoutes.put('/update/:id',[ verificaToken ],   pedidoC.actualizarPedido);
pedidoRoutes.put('/delete/:id',[ verificaToken ],   pedidoC.eliminarPedido);
pedidoRoutes.put('/deleteselected/:filtro', [ verificaToken ],   pedidoC.eliminarPedidos);


export default pedidoRoutes;
