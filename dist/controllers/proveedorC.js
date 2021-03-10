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
const proveedor_model_1 = require("../models/proveedor.model");
exports.obtenerProveedor = (req, res) => {
    const proveedor = req.proveedor;
    res.json({
        ok: true,
        proveedor
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let proveedores = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        proveedores = yield proveedor_model_1.Proveedor.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        proveedores = yield proveedor_model_1.Proveedor.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        proveedores = yield proveedor_model_1.Proveedor.find({});
    }
    res.json(proveedores);
});
exports.actualizarProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const prod = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        observacion: req.body.observacion,
    };
    if (id === 'null') { // Insertar nuevo proveedor
        const proveedor = new proveedor_model_1.Proveedor(prod);
        try {
            resp = yield proveedor.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "proveedoryaexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Proveedor.updateOne({ _id: id }, proveedor, { upsert: true }); 
            rs = yield proveedor_model_1.Proveedor.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarProveedor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield proveedor_model_1.Proveedor.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarProveedores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield proveedor_model_1.Proveedor.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Proveedores dados de baja'
    });
});
