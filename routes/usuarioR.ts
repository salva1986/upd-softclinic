import { Router } from 'express';
import { verificaToken, destruir_Token } from '../middlewares/autenticacion';
import  * as usuarioC from '../controllers/usuarioC';

const userRoutes = Router();

userRoutes.post('/login', usuarioC.login);
userRoutes.get('/', [ verificaToken ], usuarioC.obtenerUsuario);

userRoutes.get('/get/:estado', [ verificaToken ], usuarioC.verTodos);
userRoutes.put('/update/:id', [ verificaToken ], usuarioC.actualizarUsuario);
userRoutes.put('/delete/:id', [ verificaToken ], usuarioC.eliminarUsuario);
userRoutes.put('/deleteselected/:filtro', [ verificaToken ],  usuarioC.eliminarUsuarios);
userRoutes.get('/logout/:xtoken', [destruir_Token]); //Desloguear

export default userRoutes;