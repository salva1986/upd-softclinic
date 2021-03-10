"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const felSchema = new mongoose_1.Schema({
    idcita: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'citas',
        required: [true, 'Id de cita es necesario']
    },
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
exports.Fel = mongoose_1.model('Fel', felSchema);
