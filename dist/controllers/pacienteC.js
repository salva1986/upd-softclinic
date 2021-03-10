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
const paciente_model_1 = require("../models/paciente.model");
exports.obtenerPaciente = (req, res) => {
    const paciente = req.paciente;
    res.json({
        ok: true,
        paciente
    });
};
exports.verPacienteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const paciente = yield paciente_model_1.Paciente.findById(id);
    res.json(paciente);
});
exports.selectAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pacientes = {};
    pacientes = yield paciente_model_1.Paciente.find({ $where: function () { return (this.estado == true); } }).sort({ nombres: 1 });
    res.json(pacientes);
});
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pacientes = {
        total_count: 0,
        items: {}
    };
    //Total de pacientes activos - no activos
    let { texto } = req.params;
    if (req.params.estado === 'noactivos') {
        if (texto === 'undefined') {
            pacientes.items = yield paciente_model_1.Paciente.find({ estado: false }).skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            pacientes.total_count = yield paciente_model_1.Paciente.countDocuments({ estado: false });
        }
        else {
            pacientes.items = yield paciente_model_1.Paciente.find({ $and: [{ $or: [{ nombres: new RegExp(texto, 'i'), hc: new RegExp(texto, 'i') }] }, { estado: false }] }).skip(0).limit(30).sort({ nombres: 1 });
            //pacientes.total_count = await Paciente.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, {estado: false}]}).skip(0).limit(30).countDocuments({});
            pacientes.total_count = Object.keys(pacientes.items).length;
        }
    }
    else if (req.params.estado === "activos" || req.params.estado === 'undefined') {
        if (texto === 'undefined') {
            pacientes.items = yield paciente_model_1.Paciente.find({ estado: true }).skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            pacientes.total_count = yield paciente_model_1.Paciente.countDocuments({ estado: true });
        }
        else {
            pacientes.items = yield paciente_model_1.Paciente.find({ $and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, { estado: true }] }).skip(0).limit(30).sort({ nombres: 1 });
            pacientes.total_count = Object.keys(pacientes.items).length;
        }
    }
    res.json(pacientes);
});
exports.verTodosExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pacientes = {};
    pacientes = yield paciente_model_1.Paciente.find({}).sort({ codigo: 1 });
    res.json(pacientes);
});
exports.actualizarPaciente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const body = req.body;
    if (id === 'null') { // Insertar nuevo paciente
        const paciente = new paciente_model_1.Paciente(body);
        yield paciente.save();
        try {
            resp = yield paciente.save();
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
            //  rs = await Paciente.updateOne({ _id: id }, paciente, { upsert: true }); 
            rs = yield paciente_model_1.Paciente.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarPaciente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield paciente_model_1.Paciente.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarPacientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield paciente_model_1.Paciente.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Pacientes dados de baja'
    });
});
exports.consultarNit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    const { nit } = req.params;
    if (nit === '0' || nit.toLowerCase() === 'c/f' || nit.toLowerCase() === 'cf' || nit === '') {
        resp = {};
    }
    else {
        resp = yield paciente_model_1.Paciente.find({ nit }).limit(1);
    }
    res.json({
        resp
    });
});
exports.actualizardatos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpaciente } = req.params;
    const datos = {
        nit: req.body.nit,
        nombres: req.body.nombre,
        direccion: req.body.direccion,
        email: req.body.correo
    };
    let rs = "";
    if (idpaciente) {
        rs = yield paciente_model_1.Paciente.updateOne({ _id: require('mongoose').Types.ObjectId(idpaciente) }, datos);
    }
    res.json({
        rs
    });
});
