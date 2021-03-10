import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as ortopodologiaC from '../controllers/ortopodologiaC';

const ortopodologiaRoutes = Router();


ortopodologiaRoutes.get('/', [ verificaToken ], ortopodologiaC.obtenerRequisicion);

ortopodologiaRoutes.get('/get/:estado/:sort/:order/:page/:texto',  [ verificaToken ], ortopodologiaC.verTodos);
ortopodologiaRoutes.put('/update/:id',  [ verificaToken ],  ortopodologiaC.actualizarRequisicion);
ortopodologiaRoutes.put('/delete/:id', [ verificaToken ],  ortopodologiaC.eliminarRequisicion);
ortopodologiaRoutes.put('/finalizarrequisicion', [ verificaToken ],  ortopodologiaC.finalizarRequisicion);



export default ortopodologiaRoutes;