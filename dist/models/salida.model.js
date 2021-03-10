"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const salidaSchema = new mongoose_1.Schema({
    unidad: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Bodega',
        required: [true, 'La unidad solicitante es necesaria']
    },
    producto: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Producto',
        required: [true, 'El producto es necesario']
    },
    cantidad: {
        type: Number,
    },
    observaciones: {
        type: String,
    },
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Salida = mongoose_1.model('Salida', salidaSchema);
