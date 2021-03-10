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
const presentacion_model_1 = require("../models/presentacion.model");
exports.obtenerPresentacion = (req, res) => {
    const presentacion = req.presentacion;
    res.json({
        ok: true,
        presentacion
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let presentaciones = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        presentaciones = yield presentacion_model_1.Presentacion.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        presentaciones = yield presentacion_model_1.Presentacion.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        presentaciones = yield presentacion_model_1.Presentacion.find({});
    }
    res.json(presentaciones);
});
exports.actualizarPresentacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const prod = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        preciocosto: req.body.preciocosto,
        precioventa: req.body.precioventa,
        codigo: req.body.codigo,
    };
    if (id === 'null') { // Insertar nuevo presentacion
        const presentacion = new presentacion_model_1.Presentacion(prod);
        try {
            resp = yield presentacion.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "presentacionyaexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Presentacion.updateOne({ _id: id }, presentacion, { upsert: true }); 
            rs = yield presentacion_model_1.Presentacion.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarPresentacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield presentacion_model_1.Presentacion.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarPresentaciones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield presentacion_model_1.Presentacion.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Presentaciones dados de baja'
    });
});
