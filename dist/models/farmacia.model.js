"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const farmaciaSchema = new mongoose_1.Schema({
    producto: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'Producto'
    },
    cantidad: {
        type: Number
    },
    nota: {
        type: String,
    },
    unidad: {
        type: String,
    },
    estadopedido: { type: String, default: 'En espera' },
    estado: {
        type: Boolean, default: true
    },
    fechapedido: { type: Date, required: true, default: Date.now },
});
exports.Farmacia = mongoose_1.model('Farmacia', farmaciaSchema);
