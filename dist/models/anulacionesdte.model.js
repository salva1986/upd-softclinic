"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const anulacionesdteSchema = new mongoose_1.Schema({
    idcita: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'citas',
        required: [true, 'Id de cita es necesario']
    },
    identificador: String,
    numero: String,
    tipo: String,
    uuid: String,
    xml: {
        type: String,
        required: [true, 'xml necesario']
    },
    fechaanulacion: { type: Date, required: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Anulacionesdte = mongoose_1.model('Anulacionesdte', anulacionesdteSchema);
