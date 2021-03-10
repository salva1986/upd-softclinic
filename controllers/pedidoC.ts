import { Response, Request } from 'express';
import { Pedido } from '../models/pedido.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';

import { resolve } from 'dns';


export const obtenerPedido = (req: any, res: Response) => {
    const pedido = req.pedido;
    res.json({
        ok: true,
        pedido
    });
}



export const verTodos = async (req: any, res: Response) => {
    let pedidos = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        pedidos = await Pedido.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        pedidos = await Pedido.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        pedidos = await Pedido.find({});
    }

    res.json(pedidos);
}



export const actualizarPedido = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
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

    if (id === 'null') {  // Insertar nuevo pedido

        const pedido = new Pedido(pte);

        await pedido.save();
        try {
            resp = await pedido.save();
        } catch (err) {
             if(err.code===11000){
                resp = "correoexiste";
            } 
        } 

        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id


        if (id) {
            //  rs = await Pedido.updateOne({ _id: id }, pedido, { upsert: true }); 
            rs = await Pedido.updateOne({ _id: id }, pte);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarPedido = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Pedido.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarPedidos = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Pedido.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Pedidos dados de baja'
    });
};
