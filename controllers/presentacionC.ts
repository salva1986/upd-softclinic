import { Response, Request } from 'express';
import { Presentacion } from '../models/presentacion.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';

import { resolve } from 'dns';


export const obtenerPresentacion = (req: any, res: Response) => {
    const presentacion = req.presentacion;
    res.json({
        ok: true,
        presentacion
    });
}

export const verTodos = async (req: any, res: Response) => {
    let presentaciones = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        presentaciones = await Presentacion.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        presentaciones = await Presentacion.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        presentaciones = await Presentacion.find({});
    }

    res.json(presentaciones);
}



export const actualizarPresentacion = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
    const { id } = req.params;
     const prod = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        preciocosto: req.body.preciocosto,
        precioventa: req.body.precioventa,
        codigo: req.body.codigo,
    };

    if (id === 'null') {  // Insertar nuevo presentacion

        const presentacion = new Presentacion(prod);

        try {
            resp = await presentacion.save();
        } catch (err) {
             if(err.code===11000){
                resp = "presentacionyaexiste";
            } 
        } 

        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id


        if (id) {
            //  rs = await Presentacion.updateOne({ _id: id }, presentacion, { upsert: true }); 
            rs = await Presentacion.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarPresentacion = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Presentacion.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarPresentaciones = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Presentacion.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Presentaciones dados de baja'
    });
};