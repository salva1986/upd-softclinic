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
const kardexC = __importStar(require("../controllers/kardexC"));
const kardexRoutes = express_1.Router();
kardexRoutes.get('/get/:estado/:sort/:order/:page/:texto/:id', [autenticacion_1.verificaToken], kardexC.verEntradasSalidasProducto);
kardexRoutes.get('/get/verreporteIO/:fechainicio/:fechafin/:id', [autenticacion_1.verificaToken], kardexC.verReporteIO);
kardexRoutes.get('/get/verkardexsporunidad', [autenticacion_1.verificaToken], kardexC.verRequisicionesPorUnidad);
exports.default = kardexRoutes;
