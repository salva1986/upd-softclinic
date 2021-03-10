import { Router } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import * as postC  from '../controllers/postC';

const postRoutes = Router();

// Obtener POST paginados
postRoutes.get('/', [ verificaToken ],  postC.postsPaginados);

// Crear POST
postRoutes.post('/', [ verificaToken ], postC.crearPosts);

// Servicio para subir archivos
postRoutes.post( '/upload', [ verificaToken ], postC.subirArchivos);

postRoutes.get('/imagen/:userid/:img', [ verificaToken ],  postC.subirArchivos);

export default postRoutes;