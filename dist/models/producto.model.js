"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productoSchema = new mongoose_1.Schema({
    codigo: {
        type: Number
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es necesario']
    },
    nombremostrar: {
        type: String
    },
    descripcion: {
        type: String, default: ''
    },
    tipo: {
        type: Number,
    },
    presentacion: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'presentacions',
        required: [true, 'Tipo de presentación necesario']
    },
    linea: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'lineas',
        required: [true, 'Tipo de linea de producto necesario']
    },
    casa: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'casas',
        required: [true, 'Tipo de casa farmaceutica necesario']
    },
    precioventacaja: {
        type: Number
    },
    escontrolado: String,
    stock: Number,
    stockfarmacia: Number,
    stockinsumo: Number,
    stockortopodologia: Number,
    stockconsumible: Number,
    stockminimo: {
        type: Number,
        required: [true, 'El stock minimo es necesario']
    },
    entradas: [{
            factura: {
                type: mongoose_1.Schema.Types.ObjectId, ref: 'Factura',
                required: [true, 'La factura es necesaria']
            },
            cantidad: Number,
            precio: Number,
            bonificacion: String,
            vencimientoproducto: Date,
            totalbonificacion: Number,
            lote: String,
            ubicacionfisica: String,
            fecharegistro: { type: Date, default: Date.now },
            estado: { type: Boolean, default: true }
        }],
    images: {
        default: Boolean,
        id: String,
        url: String,
        type: String
    },
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});
exports.Producto = mongoose_1.model('Producto', productoSchema);
