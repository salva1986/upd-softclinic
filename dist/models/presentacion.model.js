"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const presentacionSchema = new mongoose_1.Schema({
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
exports.Presentacion = mongoose_1.model('Presentacion', presentacionSchema);
