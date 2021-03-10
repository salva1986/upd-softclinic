"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bodegaSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
    },
    contacto: {
        type: String,
    },
    telefono: {
        type: String,
    },
    estado: { type: Boolean, default: true },
    avatar: {
        type: String,
        default: 'assets/images/avatars/profile.jpg'
    },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Bodega = mongoose_1.model('Bodega', bodegaSchema);
