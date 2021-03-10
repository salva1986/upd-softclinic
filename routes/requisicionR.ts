import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as requisicionC from '../controllers/requisicionC';

const requisicionRoutes = Router();


requisicionRoutes.get('/', [ verificaToken ], requisicionC.obtenerRequisicion);

requisicionRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ],requisicionC.verRequisiciones);
requisicionRoutes.get('/get/verrequisicionesporunidad', [ verificaToken ],requisicionC.verRequisicionesPorUnidad);
requisicionRoutes.put('/update/:id', [ verificaToken ],  requisicionC.actualizarRequisicion);

export default requisicionRoutes;