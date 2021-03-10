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
Object.defineProperty(exports, "__esModule", { value: true });
const pedido_model_1 = require("../models/pedido.model");
exports.obtenerPedido = (req, res) => {
    const pedido = req.pedido;
    res.json({
        ok: true,
        pedido
    });
};
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pedidos = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        pedidos = yield pedido_model_1.Pedido.find({ $where: function () { return (this.estado == true); } });
    }
    else if (req.params.estado == "noactivos") {
        pedidos = yield pedido_model_1.Pedido.find({ $where: function () { return (this.estado == false); } });
    }
    else if (req.params.estado == 'all') {
        pedidos = yield pedido_model_1.Pedido.find({});
    }
    res.json(pedidos);
});
exports.actualizarPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const pte = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        fechanacimiento: req.body.fechanacimiento,
        email: req.body.email,
        telefono: req.body.telefono,
        direccion: req.body.direccion,
        avatar: req.body.avatar,
        nota: req.body.nota,
    };
    if (id === 'null') { // Insertar nuevo pedido
        const pedido = new pedido_model_1.Pedido(pte);
        yield pedido.save();
        try {
            resp = yield pedido.save();
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
        if (id) {
            //  rs = await Pedido.updateOne({ _id: id }, pedido, { upsert: true }); 
            rs = yield pedido_model_1.Pedido.updateOne({ _id: id }, pte);
        }
        res.json({
            rs
        });
    }
});
exports.eliminarPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield pedido_model_1.Pedido.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarPedidos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield pedido_model_1.Pedido.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Pedidos dados de baja'
    });
});
