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
const rol_model_1 = require("../models/rol.model");
exports.obtenerRol = (req, res) => {
    const rol = req.rol;
    res.json({
        ok: true,
        rol
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let roles = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        roles = yield rol_model_1.Rol.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        roles = yield rol_model_1.Rol.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        roles = yield rol_model_1.Rol.find({});
    }
    res.json(roles);
});
exports.actualizarRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const pte = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
    };
    if (id === 'null') { // Insertar nuevo rol
        const rol = new rol_model_1.Rol(pte);
        try {
            resp = yield rol.save();
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
            //  rs = await Rol.updateOne({ _id: id }, rol, { upsert: true }); 
            rs = yield rol_model_1.Rol.updateOne({ _id: id }, pte);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarRol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield rol_model_1.Rol.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield rol_model_1.Rol.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Rols dados de baja'
    });
});
