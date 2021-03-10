"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const registroPacienteC = __importStar(require("../controllers/registroPacienteC"));
const registroPacienteRoutes = express_1.Router();
//registroPacienteRoutes.get('/', [ verificaToken ], registroPacienteC.obtenerPaciente);
registroPacienteRoutes.get('/get/:estado', [autenticacion_1.verificaToken], registroPacienteC.verTodos);
registroPacienteRoutes.put('/update/:id', [autenticacion_1.verificaToken], registroPacienteC.actualizarRegistroPaciente);
registroPacienteRoutes.put('/delete/:id', [autenticacion_1.verificaToken], registroPacienteC.eliminarRegistroPaciente);
registroPacienteRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], registroPacienteC.eliminarRegistroPacientes);
exports.default = registroPacienteRoutes;
