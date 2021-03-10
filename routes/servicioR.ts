import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as servicioC from '../controllers/servicioC';

const servicioRoutes = Router();


//servicioRoutes.get('/', servicioC.obtenerServicio);

servicioRoutes.get('/get/:estado',  [ verificaToken ], servicioC.verTodos);
servicioRoutes.put('/update/:id',  [ verificaToken ], servicioC.actualizarServicio);
servicioRoutes.put('/delete/:id',  [ verificaToken ], servicioC.eliminarServicio);
servicioRoutes.put('/deleteselected/:filtro',  [ verificaToken ],  servicioC.eliminarServicios);


export default servicioRoutes;