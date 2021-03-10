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
const proveedorC = __importStar(require("../controllers/proveedorC"));
const proveedorRoutes = express_1.Router();
//proveedorRoutes.get('/', proveedorC.obtenerProveedor);
proveedorRoutes.get('/get/:estado', [autenticacion_1.verificaToken], proveedorC.verTodos);
proveedorRoutes.put('/update/:id', [autenticacion_1.verificaToken], proveedorC.actualizarProveedor);
proveedorRoutes.put('/delete/:id', [autenticacion_1.verificaToken], proveedorC.eliminarProveedor);
proveedorRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], proveedorC.eliminarProveedores);
exports.default = proveedorRoutes;
