"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const servicioSchema = new mongoose_1.Schema({
    // codigo: {
    //     type: String,
    //     unique: true,
    //     required: [ true, 'El código es necesario' ]
    // },
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
    },
    precio: {
        type: Number,
        required: [true, 'El precio es necesario']
    },
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Servicio = mongoose_1.model('Servicio', servicioSchema);
