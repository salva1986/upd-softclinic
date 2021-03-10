"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../classes/token"));
exports.verificaToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.comprobarToken(userToken)
        .then((decoded) => {
        req.usuario = decoded.usuario;
        if (decoded === false) {
            res.json({
                ok: false,
                mensaje: 'No tienes permiso para ver esta información'
                //mensaje: 'Token no es correcto'
            });
        }
        else {
            next();
        }
    });
    /*.catch( err => {
        res.json({
            ok: false,
            mensaje: 'Token no es correcto'
        });
    });*/
};
exports.destruir_Token = (req, res, next) => {
    const userToken = req.params.xtoken || '';
    let varrr = token_1.default.destruirToken(userToken)
        .then((resp) => {
        res.json({
            ok: true,
            mensaje: 'Sessión finalizada con éxito'
        });
    })
        .catch(err => {
        res.json({
            ok: false,
            mensaje: 'Error al destruir token'
        });
    });
};
