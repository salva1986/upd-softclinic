"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dteSchema = new mongoose_1.Schema({
    idcita: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'citas',
        required: [true, 'Id de cita es necesario']
    },
    tipo: String,
    xml: {
        type: String,
        required: [true, 'xml necesario']
    },
    respuesta: {
        type: String,
        required: [true, 'respuesta necesaria']
    },
    estado: { type: Boolean, required: true, default: true },
    fechacreacion: { type: Date, required: true },
});
exports.DTE = mongoose_1.model('DTE', dteSchema);
