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
const linea_model_1 = require("../models/linea.model");
exports.obtenerLinea = (req, res) => {
    const linea = req.linea;
    res.json({
        ok: true,
        linea
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let lineas = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        lineas = yield linea_model_1.Linea.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        lineas = yield linea_model_1.Linea.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        lineas = yield linea_model_1.Linea.find({});
    }
    res.json(lineas);
});
exports.actualizarLinea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (id === 'null') { // Insertar nuevo linea
        const linea = new linea_model_1.Linea(prod);
        try {
            resp = yield linea.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "lineayaexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Linea.updateOne({ _id: id }, linea, { upsert: true }); 
            rs = yield linea_model_1.Linea.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarLinea = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield linea_model_1.Linea.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarLineas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield linea_model_1.Linea.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Lineas dados de baja'
    });
});
