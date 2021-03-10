import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import  * as kardexC from '../controllers/kardexC';

const kardexRoutes = Router();

kardexRoutes.get('/get/:estado/:sort/:order/:page/:texto/:id', [ verificaToken ], kardexC.verEntradasSalidasProducto);
kardexRoutes.get('/get/verreporteIO/:fechainicio/:fechafin/:id', [verificaToken], kardexC.verReporteIO);
kardexRoutes.get('/get/verkardexsporunidad',  [ verificaToken ], kardexC.verRequisicionesPorUnidad);

export default kardexRoutes;