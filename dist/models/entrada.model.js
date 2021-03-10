"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const entradaSchema = new mongoose_1.Schema({
    proveedor: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'proveedores',
    },
    producto: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'productos',
    },
    referencia: {
        type: String,
    },
    factura: {
        type: String,
    },
    preciounidad: {
        type: Number,
    },
    cantidad: {
        type: Number,
    },
    observacion: {
        type: String,
    },
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Entrada = mongoose_1.model('Entrada', entradaSchema);
