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
const casaC = __importStar(require("../controllers/casaC"));
const casaRoutes = express_1.Router();
//casaRoutes.get('/', casaC.obtenerCasa);
casaRoutes.get('/get/:estado', [autenticacion_1.verificaToken], casaC.verTodos);
casaRoutes.put('/update/:id', [autenticacion_1.verificaToken], casaC.actualizarCasa);
casaRoutes.put('/delete/:id', [autenticacion_1.verificaToken], casaC.eliminarCasa);
casaRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], casaC.eliminarCasas);
exports.default = casaRoutes;
