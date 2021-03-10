"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const rolSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
    },
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Rol = mongoose_1.model('Rol', rolSchema);
