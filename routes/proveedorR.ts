import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as proveedorC from '../controllers/proveedorC';

const proveedorRoutes = Router();


//proveedorRoutes.get('/', proveedorC.obtenerProveedor);

proveedorRoutes.get('/get/:estado', [ verificaToken ], proveedorC.verTodos);
proveedorRoutes.put('/update/:id', [ verificaToken ],  proveedorC.actualizarProveedor);
proveedorRoutes.put('/delete/:id', [ verificaToken ],  proveedorC.eliminarProveedor);
proveedorRoutes.put('/deleteselected/:filtro', [ verificaToken ],  proveedorC.eliminarProveedores);


export default proveedorRoutes;