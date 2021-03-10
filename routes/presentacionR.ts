import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as presentacionC from '../controllers/presentacionC';

const presentacionRoutes = Router();


//presentacionRoutes.get('/', [ verificaToken ], presentacionC.obtenerPresentacion);

presentacionRoutes.get('/get/:estado', [ verificaToken ], presentacionC.verTodos);
presentacionRoutes.put('/update/:id', [ verificaToken ],  presentacionC.actualizarPresentacion);
presentacionRoutes.put('/delete/:id',  [ verificaToken ], presentacionC.eliminarPresentacion);
presentacionRoutes.put('/deleteselected/:filtro', [ verificaToken ],  presentacionC.eliminarPresentaciones);


export default presentacionRoutes;