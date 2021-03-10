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
const presentacionC = __importStar(require("../controllers/presentacionC"));
const presentacionRoutes = express_1.Router();
//presentacionRoutes.get('/', [ verificaToken ], presentacionC.obtenerPresentacion);
presentacionRoutes.get('/get/:estado', [autenticacion_1.verificaToken], presentacionC.verTodos);
presentacionRoutes.put('/update/:id', [autenticacion_1.verificaToken], presentacionC.actualizarPresentacion);
presentacionRoutes.put('/delete/:id', [autenticacion_1.verificaToken], presentacionC.eliminarPresentacion);
presentacionRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], presentacionC.eliminarPresentaciones);
exports.default = presentacionRoutes;
