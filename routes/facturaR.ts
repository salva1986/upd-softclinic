import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as facturaC from '../controllers/facturaC';

const facturaRoutes = Router();


facturaRoutes.get('/', [ verificaToken ], facturaC.obtenerFactura);

facturaRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ], facturaC.verTodos);
facturaRoutes.get('/get/infofactura/:factura', [ verificaToken ],  facturaC.verInfofactura);
facturaRoutes.put('/update/:id', [ verificaToken ], facturaC.actualizarFactura);
facturaRoutes.put('/delete/:id', [ verificaToken ], facturaC.eliminarFactura);
facturaRoutes.put('/deleteselected/:filtro', [ verificaToken ], facturaC.eliminarFacturas);


export default facturaRoutes;
