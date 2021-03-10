"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const registroPacienteSchema = new mongoose_1.Schema({
    paciente: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'pacientes',
    },
    servicio: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'servicios',
    },
    detalle: {
        type: String,
    },
    estado: { type: Boolean, default: true },
    fechaingreso: { type: Date, required: true, default: Date.now },
});
exports.RegistroPaciente = mongoose_1.model('RegistroPaciente', registroPacienteSchema);
