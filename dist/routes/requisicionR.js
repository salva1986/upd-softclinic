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
const requisicionC = __importStar(require("../controllers/requisicionC"));
const requisicionRoutes = express_1.Router();
requisicionRoutes.get('/', [autenticacion_1.verificaToken], requisicionC.obtenerRequisicion);
requisicionRoutes.get('/get/:estado/:sort/:order/:page/:texto', [autenticacion_1.verificaToken], requisicionC.verRequisiciones);
requisicionRoutes.get('/get/verrequisicionesporunidad', [autenticacion_1.verificaToken], requisicionC.verRequisicionesPorUnidad);
requisicionRoutes.put('/update/:id', [autenticacion_1.verificaToken], requisicionC.actualizarRequisicion);
exports.default = requisicionRoutes;
