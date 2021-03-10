import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as pacienteC from '../controllers/pacienteC';

const pacienteRoutes = Router();


pacienteRoutes.get('/', [ verificaToken ], pacienteC.obtenerPaciente);
pacienteRoutes.get('/getById/:id',[ verificaToken ],  pacienteC.verPacienteById);
pacienteRoutes.get('/select', [ verificaToken ], pacienteC.selectAll);
pacienteRoutes.get('/get/:estado/:sort/:order/:page/:texto', [ verificaToken ],  pacienteC.verTodos);
pacienteRoutes.get('/get/:estado', [ verificaToken ],  pacienteC.verTodosExcel);
pacienteRoutes.put('/update/:id', [ verificaToken ],  pacienteC.actualizarPaciente);
pacienteRoutes.put('/delete/:id', [ verificaToken ],   pacienteC.eliminarPaciente);
pacienteRoutes.put('/deleteselected/:filtro', [ verificaToken ],   pacienteC.eliminarPacientes);
pacienteRoutes.get('/consultarnit/:nit', [ verificaToken ],  pacienteC.consultarNit);
pacienteRoutes.put('/actualizardatos/:idpaciente', [ verificaToken ],  pacienteC.actualizardatos);


export default pacienteRoutes;