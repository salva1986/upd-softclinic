import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as consumibleC from '../controllers/consumibleC';

const consumibleRoutes = Router();


consumibleRoutes.get('/', [ verificaToken ], consumibleC.obtenerRequisicion);

consumibleRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ], consumibleC.verTodos);
consumibleRoutes.put('/update/:id', [ verificaToken ],  consumibleC.actualizarRequisicion);
consumibleRoutes.put('/delete/:id', [ verificaToken ],  consumibleC.eliminarRequisicion);
consumibleRoutes.put('/finalizarrequisicion', [ verificaToken ],  consumibleC.finalizarRequisicion);



export default consumibleRoutes;