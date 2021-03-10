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
const lineaC = __importStar(require("../controllers/lineaC"));
const lineaRoutes = express_1.Router();
//lineaRoutes.get('/', [ verificaToken ], lineaC.obtenerLinea);
lineaRoutes.get('/get/:estado', [autenticacion_1.verificaToken], lineaC.verTodos);
lineaRoutes.put('/update/:id', [autenticacion_1.verificaToken], lineaC.actualizarLinea);
lineaRoutes.put('/delete/:id', [autenticacion_1.verificaToken], lineaC.eliminarLinea);
lineaRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], lineaC.eliminarLineas);
exports.default = lineaRoutes;
