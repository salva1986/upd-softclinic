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
const producto_model_1 = require("../models/producto.model");
const stock_model_1 = require("../models/stock.model");
exports.obtenerRequisicion = (req, res) => {
    const requisicion = req.requisicion;
    res.json({
        ok: true,
        requisicion
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let requisiciones = {
        total_count: 0,
        items: {}
    };
    //Total de requisiciones activos - no activos
    let { texto } = req.params;
    if (req.params.estado === 'noactivos') {
        /*         if (texto === 'undefined') {
                    requisiciones.items = await Requisicion.find({estado: false, unidad: 'farmacia'}).populate('producto', 'nombre, stock').skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
                    requisiciones.total_count = await Requisicion.countDocuments({estado: false});
                } else {
                  requisiciones.items = await Requisicion.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i'), hc: new RegExp(texto, 'i') }] }, {estado: false, unidad: 'farmacia'}]}).populate('producto', 'nombrestock').skip(0).limit(30).sort({ nombres: 1});
        
                  requisiciones.total_count  = Object.keys(requisiciones.items).length;
                } */
    }
    else if (req.params.estado === "activos" || req.params.estado === 'undefined') {
        if (texto === 'undefined') {
            requisiciones.items = yield requisicion_model_1.Requisicion.find({ estado: true, unidad: 'farmacia' }).populate('producto', 'nombre stock').skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            requisiciones.total_count = yield requisicion_model_1.Requisicion.countDocuments({ estado: true, unidad: 'farmacia' });
        }
        else {
            requisiciones.items = yield requisicion_model_1.Requisicion.find({ $and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, { estado: true, unidad: 'farmacia' }] }).populate('producto', 'nombre stock').skip(0).limit(30).sort({ nombres: 1 });
            requisiciones.total_count = Object.keys(requisiciones.items).length;
        }
    }
    res.json(requisiciones);
});
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
                resp = "registroexistente";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            rs = yield requisicion_model_1.Requisicion.updateOne({ _id: id }, body);
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
        rs = yield requisicion_model_1.Requisicion.updateOne({ _id: id, estadopedido: 'En Espera' }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarRequisiciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*  let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
     estado = !estado;
 
     await Requisicion.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
     res.json({
         'status': 'Requisiciones dados de baja'
     }); */
});
exports.finalizarRequisicion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let idproducto = '';
    let _cantidad = 0;
    let _res;
    const prod = yield requisicion_model_1.Requisicion.find({ _id: id, estadopedido: 'Aceptado' }, { producto: 1, cantidad: 1 });
    const now = new Date();
    const rs = yield requisicion_model_1.Requisicion.updateOne({ _id: id, estadopedido: 'Aceptado' }, { $set: { estadopedido: 'Finalizado', fechafinalizacion: now } });
    if (rs.nModified) {
        idproducto = prod[0].producto;
        _cantidad = prod[0].cantidad;
        let restar = yield producto_model_1.Producto.updateOne({ _id: idproducto }, { $inc: { stock: _cantidad * -1, stockfarmacia: _cantidad } });
        if (restar.nModified) {
            yield stock_model_1.Stock.updateOne({ unidad: 'farmacia' }, { $push: { entradas: { producto: idproducto, cantidad: _cantidad } }, $inc: { stock: _cantidad } });
        }
    }
    res.json({
        rs
    });
});
