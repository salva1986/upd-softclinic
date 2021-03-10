"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ordenSchema = new mongoose_1.Schema({
    hc: {
        type: Number,
        required: [true, 'La historia clinica es necesaria']
    },
    nit: {
        type: String,
    },
    dpi: {
        type: Number,
        unique: true,
    },
    nombres: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    fechanacimiento: {
        type: Date,
        default: null
    },
    email: {
        type: String,
    },
    telefono: {
        type: String,
    },
    direccion: {
        type: String,
    },
    estado: { type: Boolean, default: true },
    nota: { type: String },
    avatar: {
        type: String,
        default: 'assets/images/avatars/profile.jpg'
    },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Orden = mongoose_1.model('Orden', ordenSchema);
