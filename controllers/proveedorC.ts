import { Response, Request } from 'express';
import { Proveedor } from '../models/proveedor.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';

import { resolve } from 'dns';


export const obtenerProveedor = (req: any, res: Response) => {
    const proveedor = req.proveedor;
    res.json({
        ok: true,
        proveedor
    });
}

export const verTodos = async (req: any, res: Response) => {
    let proveedores = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        proveedores = await Proveedor.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        proveedores = await Proveedor.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        proveedores = await Proveedor.find({});
    }

    res.json(proveedores);
}



export const actualizarProveedor = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
    const { id } = req.params;
     const prod = {
        nombre: req.body.nombre,
        direccion: req.body.direccion,
        telefono: req.body.telefono,
        observacion: req.body.observacion,
    };

    if (id === 'null') {  // Insertar nuevo proveedor

        const proveedor = new Proveedor(prod);

        try {
            resp = await proveedor.save();
        } catch (err) {
             if(err.code===11000){
                resp = "proveedoryaexiste";
            } 
        } 

        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id


        if (id) {
            //  rs = await Proveedor.updateOne({ _id: id }, proveedor, { upsert: true }); 
            rs = await Proveedor.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarProveedor = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Proveedor.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
}; 

export const eliminarProveedores = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Proveedor.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Proveedores dados de baja'
    });
};