import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as rolC from '../controllers/rolC';

const rolRoutes = Router();


rolRoutes.get('/', [ verificaToken ], rolC.obtenerRol);

rolRoutes.get('/get/:estado',  [ verificaToken ], rolC.verTodos);
rolRoutes.put('/update/:id', [ verificaToken ], rolC.actualizarRol);
rolRoutes.put('/delete/:id', [ verificaToken ], rolC.eliminarRol);
rolRoutes.put('/deleteselected/:filtro', [ verificaToken ],  rolC.eliminarRoles);


export default rolRoutes;