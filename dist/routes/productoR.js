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
const productoC = __importStar(require("../controllers/productoC"));
const productoRoutes = express_1.Router();
productoRoutes.get('/get/:estado/:sort/:order/:page/:texto', [autenticacion_1.verificaToken], productoC.verTodos);
productoRoutes.get('/get/:estado', [autenticacion_1.verificaToken], productoC.verProductosActivos);
productoRoutes.put('/registrar/:id', [autenticacion_1.verificaToken], productoC.registrarProducto);
productoRoutes.put('/delete/:id', [autenticacion_1.verificaToken], productoC.eliminarProducto);
productoRoutes.put('/deleteselected/:filtro', [autenticacion_1.verificaToken], productoC.eliminarProductos);
productoRoutes.get('/verproducto/:id', [autenticacion_1.verificaToken], productoC.verProducto);
productoRoutes.post('/addstock/:factura', [autenticacion_1.verificaToken], productoC.addStock);
productoRoutes.get('/verStock/:id', [autenticacion_1.verificaToken], productoC.verStock);
productoRoutes.get('/get/:sort/:order/:page/:id', [autenticacion_1.verificaToken], productoC.verInfoProducto);
productoRoutes.get('/get/select/productos', [autenticacion_1.verificaToken], productoC.verSelectProductos); //Especialmente para selects, solo id, nombre y stock de producto
productoRoutes.get('/detalle/producto/:id', [autenticacion_1.verificaToken], productoC.verDetalleProducto); // Muestra toda la información del producto
exports.default = productoRoutes;
