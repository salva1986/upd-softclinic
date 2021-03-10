import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as reporteC from '../controllers/reporteC';

const reporteRoutes = Router();

reporteRoutes.get('/get/totales', [ verificaToken ], reporteC.verTotales);
reporteRoutes.get('/get/fechas/:page/:fechainicio/:fechafin', [ verificaToken ],reporteC.verReportesFecha);
reporteRoutes.get('/get/verreporte/:fechainicio/:fechafin', [ verificaToken ], reporteC.verReportesAll);
//Ver reporte de productos y servicios
reporteRoutes.get('/get/verreporteproductos/:fechainicio/:fechafin', [ verificaToken ], reporteC.verProductosCita);

export default reporteRoutes;