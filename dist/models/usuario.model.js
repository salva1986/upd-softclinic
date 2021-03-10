"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuarioSchema = new mongoose_1.Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    avatar: {
        type: String,
        default: 'assets/images/avatars/profile.jpg'
    },
    email: {
        type: String,
        unique: true,
    },
    telefono: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    tipo: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'roles'
    },
    fechacreacion: { type: Date, required: true, default: Date() },
    estado: { type: Boolean, default: true }
});
usuarioSchema.method('compararPassword', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.Usuario = mongoose_1.model('Usuario', usuarioSchema);
