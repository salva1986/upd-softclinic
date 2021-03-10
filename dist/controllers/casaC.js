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
const casa_model_1 = require("../models/casa.model");
exports.obtenerCasa = (req, res) => {
    const casa = req.casa;
    res.json({
        ok: true,
        casa
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let casas = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        casas = yield casa_model_1.Casa.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        casas = yield casa_model_1.Casa.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        casas = yield casa_model_1.Casa.find({});
    }
    res.json(casas);
});
exports.actualizarCasa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (id === 'null') { // Insertar nuevo casa
        const casa = new casa_model_1.Casa(prod);
        try {
            resp = yield casa.save();
        }
        catch (err) {
            console.log(err);
            if (err.code === 11000) {
                resp = "casayaexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Casa.updateOne({ _id: id }, casa, { upsert: true }); 
            rs = yield casa_model_1.Casa.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarCasa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield casa_model_1.Casa.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarCasas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield casa_model_1.Casa.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Casas dados de baja'
    });
});
