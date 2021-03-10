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
const factura_model_1 = require("../models/factura.model");
exports.obtenerFactura = (req, res) => {
    const factura = req.factura;
    res.json({
        ok: true,
        factura
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let facturas = {
        total_count: 0,
        items: {}
    };
    //Total de facturas activos - no activos
    let { texto } = req.params;
    if (req.params.estado === 'noactivos') {
        if (texto === 'undefined') {
            facturas.items = yield factura_model_1.Factura.find({ estado: false }).populate('proveedor', 'nombre').skip((req.params.page - 1) * 15).limit(15).sort({ fechafactura: 1 });
            facturas.total_count = yield factura_model_1.Factura.countDocuments({ estado: false });
        }
        else {
            facturas.items = yield factura_model_1.Factura.find({ $and: [{ $or: [{ referenciafactura: new RegExp(texto, 'i') }] }, { estado: false }] }).populate('proveedor', 'nombre').skip(0).limit(15).sort({ fechafactura: 1 });
            facturas.total_count = Object.keys(facturas.items).length;
        }
    }
    else if (req.params.estado === "activos" || req.params.estado === 'undefined') {
        if (texto === 'undefined') {
            facturas.items = yield factura_model_1.Factura.find({ estado: true }).populate('proveedor', 'nombre').skip((req.params.page - 1) * 15).limit(15).sort({ field: 'asc', fechafactura: -1 });
            //facturas.items = await Factura.find({estado: true}).populate('proveedor', 'nombre');
            facturas.total_count = yield factura_model_1.Factura.countDocuments({ estado: true });
        }
        else {
            facturas.items = yield factura_model_1.Factura.find({ $and: [{ $or: [{ referenciafactura: new RegExp(texto, 'i') }] }, { estado: true }] }).populate('proveedor', 'nombre').skip(0).limit(15).sort({ field: 'asc', fechafactura: -1 });
            //facturas.items = await Factura.find({estado: true}).populate('proveedor', 'nombre');
            facturas.total_count = Object.keys(facturas.items).length;
        }
    }
    res.json(facturas);
});
exports.verInfofactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { factura } = req.params;
    const _factura = yield factura_model_1.Factura.find({ _id: factura, estado: true }, { fechafactura: 1, montofactura: 1, referenciafactura: 1 }).populate('proveedor', 'nombre');
    res.json(_factura);
});
exports.actualizarFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const { contado, estado, pagada } = req.body;
    contado === 'si' ? req.body.vencimientofactura = 0 : req.body.vencimientofactura;
    pagada == 'pagada' ? req.body.pagada = true : req.body.pagada = false;
    estado == null ? req.body.estado = true : req.body.estado;
    let fechaV = exports.sumarFechas(req.body.vencimientofactura, req.body.fechafactura);
    let factura_ = {};
    if (contado === 'si') {
        factura_ = {
            fechafactura: req.body.fechafactura,
            referenciafactura: req.body.referenciafactura,
            montofactura: req.body.montofactura,
            impuesto: req.body.montofactura * 0.12,
            proveedor: req.body.proveedor,
            contado: req.body.contado,
            vencimientofactura: req.body.vencimientofactura,
            pagada: req.body.pagada,
            nota: req.body.nota
        };
    }
    else {
        factura_ = {
            fechafactura: req.body.fechafactura,
            referenciafactura: req.body.referenciafactura,
            montofactura: req.body.montofactura,
            impuesto: req.body.montofactura * 0.12,
            proveedor: req.body.proveedor,
            contado: req.body.contado,
            vencimientofactura: req.body.vencimientofactura,
            pagada: req.body.pagada,
            fechavencimientofactura: fechaV,
            nota: req.body.nota
        };
    }
    if (id === 'null') { // Insertar nuevo factura
        const factura = new factura_model_1.Factura(factura_);
        yield factura.save();
        try {
            resp = yield factura.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "correoexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Factura.updateOne({ _id: id }, factura, { upsert: true }); 
            rs = yield factura_model_1.Factura.updateOne({ _id: id }, factura_);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield factura_model_1.Factura.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarFacturas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield factura_model_1.Factura.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Facturas dados de baja'
    });
});
exports.sumarFechas = (diasAsumar, fechaAmodificar) => {
    let dias = diasAsumar || '0';
    let Fecha = new Date(fechaAmodificar);
    var sFecha = (Fecha.getDate() + "/" + (Fecha.getMonth() + 1) + "/" + Fecha.getFullYear());
    //var sep = sFecha.indexOf('-') != -1 ? '/' : '-';
    let sep = "/";
    let aFecha = sFecha.split(sep);
    let fecha = aFecha[2] + '/' + aFecha[1] + '/' + aFecha[0];
    var nFecha = new Date(fecha);
    nFecha.setDate(nFecha.getDate() + parseInt(dias));
    let anno = nFecha.getFullYear();
    let mes = nFecha.getMonth() + 1;
    let dia = nFecha.getDate();
    //mes = (mes < 10) ? ("0" + mes) : mes;
    //dia = (dia < 10) ? ("0" + dia) : dia;
    var fechaFinal = anno + sep + mes + sep + dia;
    //var fechaFinal = dia + sep + mes + sep +anno;
    return (fechaFinal);
};
