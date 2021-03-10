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
const reporteC = __importStar(require("../controllers/reporteC"));
const reporteRoutes = express_1.Router();
reporteRoutes.get('/get/totales', [autenticacion_1.verificaToken], reporteC.verTotales);
reporteRoutes.get('/get/fechas/:page/:fechainicio/:fechafin', [autenticacion_1.verificaToken], reporteC.verReportesFecha);
reporteRoutes.get('/get/verreporte/:fechainicio/:fechafin', [autenticacion_1.verificaToken], reporteC.verReportesAll);
//Ver reporte de productos y servicios
reporteRoutes.get('/get/verreporteproductos/:fechainicio/:fechafin', [autenticacion_1.verificaToken], reporteC.verProductosCita);
exports.default = reporteRoutes;
