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
const ortopodologiaC = __importStar(require("../controllers/ortopodologiaC"));
const ortopodologiaRoutes = express_1.Router();
ortopodologiaRoutes.get('/', [autenticacion_1.verificaToken], ortopodologiaC.obtenerRequisicion);
ortopodologiaRoutes.get('/get/:estado/:sort/:order/:page/:texto', [autenticacion_1.verificaToken], ortopodologiaC.verTodos);
ortopodologiaRoutes.put('/update/:id', [autenticacion_1.verificaToken], ortopodologiaC.actualizarRequisicion);
ortopodologiaRoutes.put('/delete/:id', [autenticacion_1.verificaToken], ortopodologiaC.eliminarRequisicion);
ortopodologiaRoutes.put('/finalizarrequisicion', [autenticacion_1.verificaToken], ortopodologiaC.finalizarRequisicion);
exports.default = ortopodologiaRoutes;
