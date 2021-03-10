import { Response, Request } from 'express';
import { Rol } from '../models/rol.model';
import Token from '../classes/token';

import { resolve } from 'dns';


export const obtenerRol = (req: any, res: Response) => {
    const rol = req.rol;
    res.json({
        ok: true,
        rol
    });
}



export const verTodos = async (req: any, res: Response) => {
    let roles = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        roles = await Rol.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        roles = await Rol.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        roles = await Rol.find({});
    }

    res.json(roles);
}



export const actualizarRol = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
    const { id } = req.params;
     const pte = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
    };

    if (id === 'null') {  // Insertar nuevo rol

        const rol = new Rol(pte);


        try {
            resp = await rol.save();
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
            //  rs = await Rol.updateOne({ _id: id }, rol, { upsert: true }); 
            rs = await Rol.updateOne({ _id: id }, pte);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarRol = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Rol.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarRoles = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Rol.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Rols dados de baja'
    });
};