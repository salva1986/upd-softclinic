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
const ordenC = __importStar(require("../controllers/ordenC"));
const ordenRoutes = express_1.Router();
ordenRoutes.get('/', [autenticacion_1.verificaToken], ordenC.obtenerOrden);
ordenRoutes.get('/get/:estado/:sort/:order/:page/:texto', [autenticacion_1.verificaToken], ordenC.verTodos);
ordenRoutes.put('/update/:id', [autenticacion_1.verificaToken], ordenC.actualizarOrden);
ordenRoutes.put('/delete/:id', [autenticacion_1.verificaToken], ordenC.eliminarOrden);
ordenRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], ordenC.eliminarOrdenes);
exports.default = ordenRoutes;
