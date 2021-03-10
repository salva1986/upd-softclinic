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
const pedidoC = __importStar(require("../controllers/pedidoC"));
const pedidoRoutes = express_1.Router();
pedidoRoutes.get('/', [autenticacion_1.verificaToken], pedidoC.obtenerPedido);
pedidoRoutes.get('/get/:estado', [autenticacion_1.verificaToken], pedidoC.verTodos);
pedidoRoutes.put('/update/:id', [autenticacion_1.verificaToken], pedidoC.actualizarPedido);
pedidoRoutes.put('/delete/:id', [autenticacion_1.verificaToken], pedidoC.eliminarPedido);
pedidoRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], pedidoC.eliminarPedidos);
exports.default = pedidoRoutes;
