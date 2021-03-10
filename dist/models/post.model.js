"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    nombre: {
        type: String
    },
    imgs: [{
            type: String
        }],
    coords: {
        type: String // -13.313123, 12.3123123
    },
    preguntas: [{
            tipo: {
                type: String
            },
            ayuda: {
                type: String
            },
            nombre: {
                type: String
            },
            requerido: {
                type: Boolean
            },
            respuesta: [{
                    type: String
                }],
            opciones: [{
                    id: {
                        type: Number
                    },
                    nombre: {
                        type: String
                    }
                }],
            multiple: {
                type: Boolean
            }
        }],
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe de existir una referencia a un usuario']
    }
});
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
