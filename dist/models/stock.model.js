"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const stockSchema = new mongoose_1.Schema({
    unidad: String,
    stock: Number,
    entradas: [{
            producto: {
                type: mongoose_1.Schema.Types.ObjectId, ref: 'Producto'
            },
            cantidad: { type: Number, required: true, default: 0 },
            fechaentrada: { type: Date, default: Date.now },
        }],
    salidas: [{
            producto: {
                type: mongoose_1.Schema.Types.ObjectId, ref: 'Producto'
            },
            cantidad: { type: Number, required: true, default: 0 },
            fechaentrada: { type: Date, default: Date.now },
        }],
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Stock = mongoose_1.model('Stock', stockSchema);
