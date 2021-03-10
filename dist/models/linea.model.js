"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const lineaSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
    },
    preciocosto: {
        type: Number,
    },
    precioventa: {
        type: String,
    },
    codigo: {
        type: String,
    },
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Linea = mongoose_1.model('Linea', lineaSchema);
