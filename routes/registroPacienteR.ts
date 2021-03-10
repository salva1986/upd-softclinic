import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as registroPacienteC from '../controllers/registroPacienteC';

const registroPacienteRoutes = Router();


//registroPacienteRoutes.get('/', [ verificaToken ], registroPacienteC.obtenerPaciente);

registroPacienteRoutes.get('/get/:estado', [ verificaToken ], registroPacienteC.verTodos);
registroPacienteRoutes.put('/update/:id', [ verificaToken ],   registroPacienteC.actualizarRegistroPaciente);
registroPacienteRoutes.put('/delete/:id',[ verificaToken ],   registroPacienteC.eliminarRegistroPaciente);
registroPacienteRoutes.put('/deleteselected/:filtro',[ verificaToken ],   registroPacienteC.eliminarRegistroPacientes);

export default registroPacienteRoutes;