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
const salida_model_1 = require("../models/salida.model");
exports.obtenerSalida = (req, res) => {
    const salida = req.salida;
    res.json({
        ok: true,
        salida
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let salidas = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        salidas = yield salida_model_1.Salida.find({ $where: function () { return (this.estado == true); } }).populate({ path: 'producto', model: 'Producto' });
    }
    else if (req.params.estado == "noactivos") {
        salidas = yield salida_model_1.Salida.find({ $where: function () { return (this.estado == false); } }).populate({ path: 'producto', model: 'Producto' });
    }
    else if (req.params.estado == 'all') {
        salidas = yield salida_model_1.Salida.find({}).populate({ path: 'producto', model: 'Producto' });
    }
    res.json(salidas);
});
exports.actualizarSalida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const body = req.body;
    if (id === 'null') { // Insertar nuevo salida
        const salida = new salida_model_1.Salida(body);
        yield salida.save();
        try {
            resp = yield salida.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "duplicado";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Salida.updateOne({ _id: id }, salida, { upsert: true }); 
            rs = yield salida_model_1.Salida.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarSalida = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield salida_model_1.Salida.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarSalidas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield salida_model_1.Salida.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Salidas dados de baja'
    });
});
