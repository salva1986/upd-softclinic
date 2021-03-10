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
const consumibleC = __importStar(require("../controllers/consumibleC"));
const consumibleRoutes = express_1.Router();
consumibleRoutes.get('/', [autenticacion_1.verificaToken], consumibleC.obtenerRequisicion);
consumibleRoutes.get('/get/:estado/:sort/:order/:page/:texto', [autenticacion_1.verificaToken], consumibleC.verTodos);
consumibleRoutes.put('/update/:id', [autenticacion_1.verificaToken], consumibleC.actualizarRequisicion);
consumibleRoutes.put('/delete/:id', [autenticacion_1.verificaToken], consumibleC.eliminarRequisicion);
consumibleRoutes.put('/finalizarrequisicion', [autenticacion_1.verificaToken], consumibleC.finalizarRequisicion);
exports.default = consumibleRoutes;
