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
const orden_model_1 = require("../models/orden.model");
exports.obtenerOrden = (req, res) => {
    const orden = req.orden;
    res.json({
        ok: true,
        orden
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let ordenes = {
        total_count: 0,
        items: {}
    };
    //Total de ordenes activos - no activos
    let { texto } = req.params;
    if (req.params.estado === 'noactivos') {
        if (texto === 'undefined') {
            ordenes.items = yield orden_model_1.Orden.find({ estado: false }).skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            ordenes.total_count = yield orden_model_1.Orden.countDocuments({ estado: false });
        }
        else {
            ordenes.items = yield orden_model_1.Orden.find({ $and: [{ $or: [{ nombres: new RegExp(texto, 'i'), hc: new RegExp(texto, 'i') }] }, { estado: false }] }).skip(0).limit(30).sort({ nombres: 1 });
            //ordenes.total_count = await Orden.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, {estado: false}]}).skip(0).limit(30).countDocuments({});
            ordenes.total_count = Object.keys(ordenes.items).length;
        }
    }
    else if (req.params.estado === "activos" || req.params.estado === 'undefined') {
        if (texto === 'undefined') {
            ordenes.items = yield orden_model_1.Orden.find({ estado: true }).skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            ordenes.total_count = yield orden_model_1.Orden.countDocuments({ estado: true });
        }
        else {
            ordenes.items = yield orden_model_1.Orden.find({ $and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, { estado: true }] }).skip(0).limit(30).sort({ nombres: 1 });
            ordenes.total_count = Object.keys(ordenes.items).length;
        }
    }
    res.json(ordenes);
});
exports.actualizarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const body = req.body;
    if (id === 'null') { // Insertar nuevo orden
        const orden = new orden_model_1.Orden(body);
        yield orden.save();
        try {
            resp = yield orden.save();
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
            //  rs = await Orden.updateOne({ _id: id }, orden, { upsert: true }); 
            rs = yield orden_model_1.Orden.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield orden_model_1.Orden.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarOrdenes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield orden_model_1.Orden.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Ordenes dados de baja'
    });
});
