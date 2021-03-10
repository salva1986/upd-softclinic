"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const facturaSchema = new mongoose_1.Schema({
    fechafactura: {
        type: Date,
        required: [true, 'Fecha es necesaria']
    },
    referenciafactura: {
        type: String,
        required: [true, 'Referencia necesaria']
    },
    montofactura: {
        type: Number
    },
    impuesto: {
        type: Number,
    },
    proveedor: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Proveedor',
    },
    contado: {
        type: String,
    },
    vencimientofactura: {
        type: String,
    },
    pagada: { type: Boolean, default: true },
    fechavencimientofactura: {
        type: Date,
    },
    nota: { type: String },
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Factura = mongoose_1.model('Factura', facturaSchema);
