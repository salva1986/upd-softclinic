import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as farmaciaC from '../controllers/farmaciaC';

const farmaciaRoutes = Router();


farmaciaRoutes.get('/', [ verificaToken ], farmaciaC.obtenerRequisicion);

farmaciaRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ],  farmaciaC.verTodos);
farmaciaRoutes.put('/update/:id', [ verificaToken ],  farmaciaC.actualizarRequisicion);
farmaciaRoutes.put('/delete/:id', [ verificaToken ],  farmaciaC.eliminarRequisicion);
farmaciaRoutes.put('/finalizarrequisicion', [ verificaToken ],  farmaciaC.finalizarRequisicion);



export default farmaciaRoutes;