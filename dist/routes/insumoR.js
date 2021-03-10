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
const insumoC = __importStar(require("../controllers/insumoC"));
const insumoRoutes = express_1.Router();
insumoRoutes.get('/', [autenticacion_1.verificaToken], insumoC.obtenerRequisicion);
insumoRoutes.get('/get/:estado/:sort/:order/:page/:texto', [autenticacion_1.verificaToken], insumoC.verTodos);
insumoRoutes.put('/update/:id', [autenticacion_1.verificaToken], insumoC.actualizarRequisicion);
insumoRoutes.put('/delete/:id', [autenticacion_1.verificaToken], insumoC.eliminarRequisicion);
insumoRoutes.put('/finalizarrequisicion', [autenticacion_1.verificaToken], insumoC.finalizarRequisicion);
exports.default = insumoRoutes;
