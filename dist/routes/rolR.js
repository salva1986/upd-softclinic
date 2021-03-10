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
const rolC = __importStar(require("../controllers/rolC"));
const rolRoutes = express_1.Router();
rolRoutes.get('/', [autenticacion_1.verificaToken], rolC.obtenerRol);
rolRoutes.get('/get/:estado', [autenticacion_1.verificaToken], rolC.verTodos);
rolRoutes.put('/update/:id', [autenticacion_1.verificaToken], rolC.actualizarRol);
rolRoutes.put('/delete/:id', [autenticacion_1.verificaToken], rolC.eliminarRol);
rolRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], rolC.eliminarRoles);
exports.default = rolRoutes;
