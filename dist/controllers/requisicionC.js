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
const requisicion_model_1 = require("../models/requisicion.model");
exports.obtenerRequisicion = (req, res) => {
    const requisicion = req.requisicion;
    res.json({
        ok: true,
        requisicion
    });
};
exports.actualizarRequisicion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const body = req.body;
    req.body.unidad = 'farmacia';
    if (id === 'null') { // Insertar nuevo requisicion
        const requisicion = new requisicion_model_1.Requisicion(body);
        yield requisicion.save();
        try {
            resp = yield requisicion.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "registroexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            rs = yield requisicion_model_1.Requisicion.updateOne({ _id: id, estado: true }, { $set: { estadopedido: body.estadopedido } });
        }
        res.json({
            rs
        });
    }
});
exports.eliminarRequisicion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield requisicion_model_1.Requisicion.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarRequisiciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield requisicion_model_1.Requisicion.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Requisiciones dados de baja'
    });
});
exports.verRequisiciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let requisiciones = {
        total_count: 0,
        items: {}
    };
    //Total de requisiciones activos - no activos
    let { texto, estado } = req.params;
    estado === 'undefined' ? estado = 'consumible' : estado;
    if (texto === 'undefined') {
        requisiciones.items = yield requisicion_model_1.Requisicion.find({ estado: true, unidad: estado }).populate('producto', 'nombre stock').skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
        requisiciones.total_count = yield requisicion_model_1.Requisicion.countDocuments({ estado: true, unidad: estado });
    }
    else {
        //requisiciones.items = await Requisicion.find({$and: [{ $or: [{ estadopedido: new RegExp(texto, 'i'),  cantidad: {'$regex': texto} }] }, {estado: true,  unidad: estado}]}).populate('producto', 'nombre stock').skip(0).limit(30).sort({ nombres: 1 });
        requisiciones.items = yield requisicion_model_1.Requisicion.find({ $and: [{ $or: [{ estadopedido: { '$regex': texto } }] }, { estado: true, unidad: estado }] }).populate('producto', 'nombre stock').skip(0).limit(30).sort({ nombres: 1 });
        requisiciones.total_count = Object.keys(requisiciones.items).length;
    }
    res.json(requisiciones);
});
exports.verRequisicionesPorUnidad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let requisiciones = {
        ortopodologia: 0,
        insumos: 0,
        consumibles: 0,
        farmacia: 0,
    };
    // requisiciones = await Requisicion.aggregate([ { $match: { estadopedido: { $lte: 'En Espera' } } }, {"$group" : {_id:{estado:"$estadopedido",unidad:"$unidad"}, total:{$sum:1}}},{$sort:{"unidad":1}} ])
    requisiciones.ortopodologia = yield requisicion_model_1.Requisicion.countDocuments({ estadopedido: 'En Espera', unidad: 'ortopodologia', estado: true });
    requisiciones.insumos = yield requisicion_model_1.Requisicion.countDocuments({ estadopedido: 'En Espera', unidad: 'insumo', estado: true });
    requisiciones.consumibles = yield requisicion_model_1.Requisicion.countDocuments({ estadopedido: 'En Espera', unidad: 'consumible', estado: true });
    requisiciones.farmacia = yield requisicion_model_1.Requisicion.countDocuments({ estadopedido: 'En Espera', unidad: 'farmacia', estado: true });
    res.json(requisiciones);
});
