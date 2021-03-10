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
const entrada_model_1 = require("../models/entrada.model");
exports.obtenerEntrada = (req, res) => {
    const entrada = req.entrada;
    res.json({
        ok: true,
        entrada
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let entradas = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        entradas = yield entrada_model_1.Entrada.find({ $where: function () { return (this.estado == true); } }).populate({ path: 'proveedor', model: 'Proveedor' }).populate({ path: 'producto', model: 'Producto' });
    }
    else if (req.params.estado == "noactivos") {
        entradas = yield entrada_model_1.Entrada.find({ $where: function () { return (this.estado == false); } }).populate({ path: 'producto', model: 'Producto' }).populate({ path: 'producto', model: 'Producto' });
    }
    else if (req.params.estado == 'all') {
        entradas = yield entrada_model_1.Entrada.find({});
    }
    res.json(entradas);
});
exports.actualizarEntrada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const entr = {
        proveedor: req.body.proveedor,
        producto: req.body.producto,
        referencia: req.body.referencia,
        factura: req.body.factura,
        preciounidad: req.body.preciounidad,
        cantidad: req.body.cantidad,
        observacion: req.body.observacion,
    };
    if (id === 'null' || id === undefined) { // Insertar nuevo entrada
        const entrada = new entrada_model_1.Entrada(entr);
        try {
            resp = yield entrada.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "nombreyaexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Entrada.updateOne({ _id: id }, entrada, { upsert: true }); 
            rs = yield entrada_model_1.Entrada.updateOne({ _id: id }, entr);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarEntrada = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield entrada_model_1.Entrada.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarEntradas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield entrada_model_1.Entrada.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Entradas dados de baja'
    });
});
