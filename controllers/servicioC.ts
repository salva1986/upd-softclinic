import { Response, Request } from 'express';
import { Servicio } from '../models/servicio.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';

import { resolve } from 'dns';


export const obtenerServicio = (req: any, res: Response) => {
    const servicio = req.servicio;
    res.json({
        ok: true,
        servicio
    });
}

export const verTodos = async (req: any, res: Response) => {
    let servicios = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        servicios = await Servicio.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        servicios = await Servicio.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        servicios = await Servicio.find({});
    }

    res.json(servicios);
}

export const actualizarServicio = async (req: any, res: Response) => {
    let rs = "";
    let resp: any;
    const { id } = req.params;
    const prod = req.body;
    prod.estado = true;
    if (id === 'null') {  // Insertar nuevo servicio
        const servicio = new Servicio(prod);
        try {
            resp = await servicio.save();
        } catch (err) {
             if(err.code===11000){
                resp = "servicioyaexiste";
            } 
        }
        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id
        if (id) {
            //  rs = await Servicio.updateOne({ _id: id }, servicio, { upsert: true }); 
            rs = await Servicio.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarServicio = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Servicio.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
}; 

export const eliminarServicios = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Servicio.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Servicios dados de baja'
    });
};