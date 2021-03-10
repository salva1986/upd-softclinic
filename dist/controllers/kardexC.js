"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const producto_model_1 = require("../models/producto.model");
const requisicion_model_1 = require("../models/requisicion.model");
exports.verEntradasSalidasProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let entradassalidas = {
        total_count: {},
        items: {}
    };
    let { id, estado } = req.params;
    if (id !== '0') {
        if (estado === 'undefined' || estado === 'entradas') {
            entradassalidas.items = yield producto_model_1.Producto.find({ _id: id, estado: true }, { entradas: { $slice: [(req.params.page - 1) * 10, 10] }, codigo: 1, nombre: 1, descripcion: 1, stock: 1 }).populate('entradas.factura', 'referenciafactura');
            entradassalidas.total_count = yield producto_model_1.Producto.aggregate([
                { $match: { _id: require('mongoose').Types.ObjectId(id) } },
                { $unwind: "$entradas" },
                { $group: { _id: "null", number: { $sum: 1 } } }
            ]);
        }
        else if (estado === 'salidas') {
            entradassalidas.items = yield requisicion_model_1.Requisicion.find({ producto: id, estadopedido: 'Finalizado' }).populate({ path: 'producto', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'descripcion': 1 } }).skip((req.params.page - 1) * 10).limit(10).sort({ fechafinalizacion: -1 });
            entradassalidas.total_count = yield requisicion_model_1.Requisicion.countDocuments({ producto: id, estadopedido: 'Finalizado' });
        }
    }
    res.json(entradassalidas);
});
exports.verReporteIO = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let fechainicio = new Date(req.params.fechainicio);
    let fechafin = new Date(req.params.fechafin);
    const anio = fechainicio.getFullYear();
    const mes = fechainicio.getMonth() + 1;
    const hoy = fechainicio.getDate();
    const anio2 = fechafin.getFullYear();
    const mes2 = fechafin.getMonth() + 1;
    const hoy2 = fechafin.getDate();
    const fechainicio2 = new Date(`${anio}-${mes}-${hoy}`);
    const fechafin2 = new Date(`${anio2}-${mes2}-${hoy2}`);
    /*   const entradas = await  Producto.find({ estado: true,  "entradas.fecharegistro": { "$gte": fechainicio2, "$lt": fechafin2 }  }).populate({ path: 'entradas.producto', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1,  'descripcion': 1 } }); */
    const entradas = yield producto_model_1.Producto.aggregate([
        { $match: { _id: require('mongoose').Types.ObjectId(id), 'entradas.estado': true } },
        {
            '$unwind': '$entradas'
        },
        { $match: { _id: require('mongoose').Types.ObjectId(id), 'entradas.estado': true } },
        { $project: {
                nombre: '$nombre',
                descripcion: '$descripcion',
                cantidad: '$entradas.cantidad',
                bonificacion: '$entradas.totalbonificacion',
                preciocompra: '$entradas.precio',
                vencimiento: '$entradas.vencimientoproducto',
                lote: '$entradas.lote',
                ubicacion: '$entradas.ubicacionfisica',
                dia: { $cond: ['$entradas.fecharegistro', { $dayOfMonth: '$entradas.fecharegistro' }, -1] },
                mes: { $cond: ['$entradas.fecharegistro', { $month: '$entradas.fecharegistro' }, -1] },
                anio: { $cond: ['$entradas.fecharegistro', { $year: '$entradas.fecharegistro' }, -1] }
            } },
        { $match: { 'mes': 2, 'anio': 2020 } }
    ]);
    res.json(entradas);
});
exports.verRequisicionesPorUnidad = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
