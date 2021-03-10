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
const registropaciente_model_1 = require("../models/registropaciente.model");
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let registropacientes = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        registropacientes = yield registropaciente_model_1.RegistroPaciente.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        registropacientes = yield registropaciente_model_1.RegistroPaciente.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        registropacientes = yield registropaciente_model_1.RegistroPaciente.find({});
    }
    res.json(registropacientes);
});
exports.actualizarRegistroPaciente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const reg = {
        paciente: req.body.paciente,
        servicio: req.body.servicio,
        detalle: req.body.detalle,
    };
    if (id === 'null') { // Insertar nuevo paciente
        const registro = new registropaciente_model_1.RegistroPaciente(reg);
        yield registro.save();
        try {
            resp = yield registro.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "duplicaciondedato";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await RegistroPaciente.updateOne({ _id: id }, paciente, { upsert: true }); 
            rs = yield registropaciente_model_1.RegistroPaciente.updateOne({ _id: id }, reg);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarRegistroPaciente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield registropaciente_model_1.RegistroPaciente.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarRegistroPacientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield registropaciente_model_1.RegistroPaciente.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Registros dados de baja'
    });
});
