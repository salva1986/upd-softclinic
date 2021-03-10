"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const util_1 = require("util");
exports.login = (req, res) => {
    const body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombres,
                email: userDB.email,
                avatar: userDB.avatar,
                tipo: userDB.tipo
            }).then((tokengenerado) => {
                res.json({
                    ok: true,
                    token: tokengenerado
                });
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
    });
};
exports.crearUsuario = (req, res) => {
    const user = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
        tipo: req.body.tipo
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombres,
            email: userDB.email,
            avatar: userDB.avatar,
            tipo: userDB.tipo
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
};
exports.obtenerUsuario = (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let usuarios = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        usuarios = yield usuario_model_1.Usuario.find({ $where: function () { return (this.estado == true); } }, { 'password': 0 }).populate({ path: 'tipo', model: 'Rol', select: { 'nombre': 1 } });
    }
    else if (req.params.estado == "noactivos") {
        usuarios = yield usuario_model_1.Usuario.find({ $where: function () { return (this.estado == false); } }, { 'password': 0 }).populate({ path: 'tipo', model: 'Rol', select: { 'nombre': 1 } });
    }
    else if (req.params.estado == 'all') {
        usuarios = yield usuario_model_1.Usuario.find({}, { 'password': 0 }).populate({ path: 'tipo', model: 'Rol', select: { 'nombre': 1 } });
    }
    res.json(usuarios);
});
exports.actualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    if (id === 'null') { // Insertar nuevo usuario
        const user = {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            avatar: req.body.avatar,
            email: req.body.email,
            password: bcrypt_1.default.hashSync(req.body.pass2, 10),
            tipo: req.body.tipo,
            telefono: req.body.telefono
        };
        const usuario = new usuario_model_1.Usuario(user);
        try {
            resp = yield usuario.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "correoexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (util_1.isNullOrUndefined(req.body.pass2)) {
            req.body.pass2 = "*#$%&/(/)(&)/&)%$&$&%$&%$%$#$#$%%&(/(/&(/&(/&(";
        }
        let usuario = {};
        if (req.body.cambiocontrasena === 'si') {
            usuario = {
                // nombres: req.body.nombres,
                //apellidos: req.body.apellidos,
                email: req.body.email,
                password: bcrypt_1.default.hashSync(req.body.pass2, 10),
                tipo: req.body.tipo,
                telefono: req.body.telefono
            };
        }
        else {
            usuario = {
                // nombres: req.body.nombres,
                //apellidos: req.body.apellidos,
                email: req.body.email,
                tipo: req.body.tipo,
                telefono: req.body.telefono
            };
        }
        if (id) {
            //  rs = await Usuario.updateOne({ _id: id }, usuario, { upsert: true }); 
            rs = yield usuario_model_1.Usuario.updateOne({ _id: id }, usuario);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield usuario_model_1.Usuario.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield usuario_model_1.Usuario.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Usuarios dados de baja'
    });
});
exports.destruir_Token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("destruir_Token ", req);
    res.json({
        'status': 'Usuarios dados de baja'
    });
});
