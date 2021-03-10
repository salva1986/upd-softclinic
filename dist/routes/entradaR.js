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
const entradaC = __importStar(require("../controllers/entradaC"));
const entradaRoutes = express_1.Router();
//entradaRoutes.get('/', entradaC.obtenerEntrada);
entradaRoutes.get('/get/:estado', [autenticacion_1.verificaToken], entradaC.verTodos);
entradaRoutes.post('/create/:id', [autenticacion_1.verificaToken], entradaC.actualizarEntrada);
entradaRoutes.put('/delete/:id', [autenticacion_1.verificaToken], entradaC.eliminarEntrada);
entradaRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], entradaC.eliminarEntradas);
exports.default = entradaRoutes;
