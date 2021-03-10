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
const postC = __importStar(require("../controllers/postC"));
const postRoutes = express_1.Router();
// Obtener POST paginados
postRoutes.get('/', [autenticacion_1.verificaToken], postC.postsPaginados);
// Crear POST
postRoutes.post('/', [autenticacion_1.verificaToken], postC.crearPosts);
// Servicio para subir archivos
postRoutes.post('/upload', [autenticacion_1.verificaToken], postC.subirArchivos);
postRoutes.get('/imagen/:userid/:img', [autenticacion_1.verificaToken], postC.subirArchivos);
exports.default = postRoutes;
