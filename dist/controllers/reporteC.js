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
const cita_model_1 = require("../models/cita.model");
exports.verTotales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fecha = new Date();
    let dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    let totales = {};
    const totalHoy = yield cita_model_1.Cita.aggregate([
        { $match: { "factura.facturaanulada": { $ne: true } } },
        {
            "$redact": {
                "$cond": [{
                        "$and": [{ "$eq": [{ "$year": "$factura.fecha" }, anio] }, { "$eq": [{ "$month": "$factura.fecha" }, mes] },
                            { "$eq": [{ "$dayOfMonth": "$factura.fecha" }, dia] }]
                    }, "$$KEEP", "$$PRUNE"]
            }
        },
        { $group: { _id: null, 'total': { $sum: '$factura.total' }, 'descuento': { $sum: '$factura.descuento' } } }
    ]);
    if (totalHoy[0]) {
        totales.hoy = totalHoy[0].total - totalHoy[0].descuento;
    }
    const totalMes = yield cita_model_1.Cita.aggregate([
        { $match: { "factura.facturaanulada": { $ne: true } } },
        { "$redact": { "$cond": [{ "$and": [{ "$eq": [{ "$year": "$factura.fecha" }, anio] }, { "$eq": [{ "$month": "$factura.fecha" }, mes] }] }, "$$KEEP", "$$PRUNE"] } },
        { $group: { _id: null, 'total': { $sum: '$factura.total' }, 'descuento': { $sum: '$factura.descuento' } } }
    ]);
    //  console.log("total", totalMes[0].total, "descuento ", totalMes[0].descuento);
    if (totalMes[0]) {
        totales.mes = totalMes[0].total - totalMes[0].descuento;
    }
    res.json(totales);
});
exports.verReportesFecha = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number.parseFloat(req.params.page);
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
    //console.log('fechainicio2 ', fechainicio2);
    //console.log('fechafin2 ', fechafin2);
    let facturas = {
        total_count: 0,
        items: {}
    };
    facturas.items = yield cita_model_1.Cita.find({ estado: true, finalizada: true, "factura.fecha": { "$gte": fechainicio2, "$lte": fechafin2 } }, { factura: 1, unidad: 1 }).sort({ 'factura.nofactura': 1 }).populate({ path: 'paciente', model: 'Paciente' }).skip((page - 1) * 15).limit(15);
    facturas.total_count = yield cita_model_1.Cita.countDocuments({ estado: true, finalizada: true, "factura.facturaanulada": { $ne: true }, "factura.fecha": { "$gte": fechainicio2, "$lte": fechafin2 } });
    res.json(facturas);
});
exports.verReportesAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    /* console.log('fechainicio2 ', fechainicio2);
    console.log('fechafin2 ', fechafin2); */
    const facturas = yield cita_model_1.Cita.find({ estado: true, finalizada: true, "factura.facturaanulada": { $ne: true }, "factura.fecha": { "$gte": fechainicio2, "$lte": fechafin2 } }, { factura: 1, unidad: 1 }).sort({ 'factura.nofactura': 1 }).populate({ path: 'paciente', model: 'Paciente' });
    res.json(facturas);
});
exports.verProductosCita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const cita = yield cita_model_1.Cita.find({ estado: true, finalizada: true, "factura.facturaanulada": { $ne: true }, "factura.fecha": { "$gte": fechainicio2, "$lte": fechafin2 } })
        .populate({ path: 'paciente', model: 'Paciente' })
        .populate({ path: 'servicios.id', model: 'Servicio', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } })
        .populate({ path: 'consumibles.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } })
        .populate({ path: 'insumos.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } })
        .populate({ path: 'productos.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } })
        .populate({ path: 'ortopodologia.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } });
    res.json(cita);
});
//https://stackoverflow.com/questions/57164135/mongodb-double-nested-array-to-reserve-unwind
//https://stackoverflow.com/questions/29195272/mongodb-aggregation-unwind-more-than-one-array
/* const moment = require('moment')

const today = moment().startOf('day')

MyModel.find({
  createdAt: {
    $gte: today.toDate(),
    $lte: moment(today).endOf('day').toDate()
  }
}) */ 
