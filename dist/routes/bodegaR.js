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
const bodegaC = __importStar(require("../controllers/bodegaC"));
const bodegaRoutes = express_1.Router();
bodegaRoutes.get('/', [autenticacion_1.verificaToken], bodegaC.obtenerBodega);
bodegaRoutes.get('/get/:estado', [autenticacion_1.verificaToken], bodegaC.verTodos);
bodegaRoutes.put('/update/:id', [autenticacion_1.verificaToken], bodegaC.actualizarBodega);
bodegaRoutes.put('/delete/:id', [autenticacion_1.verificaToken], bodegaC.eliminarBodega);
bodegaRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], bodegaC.eliminarBodegas);
exports.default = bodegaRoutes;
