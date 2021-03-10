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
const servicio_model_1 = require("../models/servicio.model");
exports.obtenerServicio = (req, res) => {
    const servicio = req.servicio;
    res.json({
        ok: true,
        servicio
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let servicios = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        servicios = yield servicio_model_1.Servicio.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        servicios = yield servicio_model_1.Servicio.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        servicios = yield servicio_model_1.Servicio.find({});
    }
    res.json(servicios);
});
exports.actualizarServicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const prod = req.body;
    prod.estado = true;
    if (id === 'null') { // Insertar nuevo servicio
        const servicio = new servicio_model_1.Servicio(prod);
        try {
            resp = yield servicio.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "servicioyaexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Servicio.updateOne({ _id: id }, servicio, { upsert: true }); 
            rs = yield servicio_model_1.Servicio.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarServicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield servicio_model_1.Servicio.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarServicios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield servicio_model_1.Servicio.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Servicios dados de baja'
    });
});
