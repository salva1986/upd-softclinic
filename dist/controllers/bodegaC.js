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
const bodega_model_1 = require("../models/bodega.model");
exports.obtenerBodega = (req, res) => {
    const bodega = req.bodega;
    res.json({
        ok: true,
        bodega
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let bodegas = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        bodegas = yield bodega_model_1.Bodega.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        bodegas = yield bodega_model_1.Bodega.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        bodegas = yield bodega_model_1.Bodega.find({});
    }
    res.json(bodegas);
});
exports.actualizarBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const body = req.body;
    if (id === 'null') { // Insertar nuevo bodega
        const bodega = new bodega_model_1.Bodega(body);
        yield bodega.save();
        try {
            resp = yield bodega.save();
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
            //  rs = await Bodega.updateOne({ _id: id }, bodega, { upsert: true }); 
            rs = yield bodega_model_1.Bodega.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarBodega = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield bodega_model_1.Bodega.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarBodegas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield bodega_model_1.Bodega.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Bodegas dados de baja'
    });
});
