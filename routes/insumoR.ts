import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as insumoC from '../controllers/insumoC';

const insumoRoutes = Router();


insumoRoutes.get('/', [ verificaToken ], insumoC.obtenerRequisicion);

insumoRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ], insumoC.verTodos);
insumoRoutes.put('/update/:id', [ verificaToken ],  insumoC.actualizarRequisicion);
insumoRoutes.put('/delete/:id',  [ verificaToken ], insumoC.eliminarRequisicion);
insumoRoutes.put('/finalizarrequisicion', [ verificaToken ],  insumoC.finalizarRequisicion);



export default insumoRoutes;