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
const servicioC = __importStar(require("../controllers/servicioC"));
const servicioRoutes = express_1.Router();
//servicioRoutes.get('/', servicioC.obtenerServicio);
servicioRoutes.get('/get/:estado', [autenticacion_1.verificaToken], servicioC.verTodos);
servicioRoutes.put('/update/:id', [autenticacion_1.verificaToken], servicioC.actualizarServicio);
servicioRoutes.put('/delete/:id', [autenticacion_1.verificaToken], servicioC.eliminarServicio);
servicioRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], servicioC.eliminarServicios);
exports.default = servicioRoutes;
