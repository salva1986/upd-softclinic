"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pedidoSchema = new mongoose_1.Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    fechanacimiento: {
        type: Date,
        default: null
    },
    email: {
        type: String,
        unique: true,
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
exports.Pedido = mongoose_1.model('Pedido', pedidoSchema);
