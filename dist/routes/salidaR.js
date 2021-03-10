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
const salidaC = __importStar(require("../controllers/salidaC"));
const salidaRoutes = express_1.Router();
salidaRoutes.get('/', [autenticacion_1.verificaToken], salidaC.obtenerSalida);
salidaRoutes.get('/get/:estado', [autenticacion_1.verificaToken], salidaC.verTodos);
salidaRoutes.put('/update/:id', [autenticacion_1.verificaToken], salidaC.actualizarSalida);
salidaRoutes.put('/delete/:id', [autenticacion_1.verificaToken], salidaC.eliminarSalida);
salidaRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], salidaC.eliminarSalidas);
exports.default = salidaRoutes;
