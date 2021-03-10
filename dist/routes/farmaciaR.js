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
const farmaciaC = __importStar(require("../controllers/farmaciaC"));
const farmaciaRoutes = express_1.Router();
farmaciaRoutes.get('/', [autenticacion_1.verificaToken], farmaciaC.obtenerRequisicion);
farmaciaRoutes.get('/get/:estado/:sort/:order/:page/:texto', [autenticacion_1.verificaToken], farmaciaC.verTodos);
farmaciaRoutes.put('/update/:id', [autenticacion_1.verificaToken], farmaciaC.actualizarRequisicion);
farmaciaRoutes.put('/delete/:id', [autenticacion_1.verificaToken], farmaciaC.eliminarRequisicion);
farmaciaRoutes.put('/finalizarrequisicion', [autenticacion_1.verificaToken], farmaciaC.finalizarRequisicion);
exports.default = farmaciaRoutes;
