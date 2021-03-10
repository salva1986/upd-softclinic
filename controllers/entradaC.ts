import { Response, Request } from 'express';
import { Entrada } from '../models/entrada.model';
import { Producto } from '../models/producto.model';


import { resolve } from 'dns';


export const obtenerEntrada = (req: any, res: Response) => {
    const entrada = req.entrada;
    res.json({
        ok: true,
        entrada
    });
}



export const verTodos = async (req: any, res: Response) => {
    let entradas = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        entradas = await Entrada.find({ $where: function () { return (this.estado == true) } }).populate({ path: 'proveedor', model: 'Proveedor' }).populate({ path: 'producto', model: 'Producto' });
    } else if (req.params.estado == "noactivos") {
        entradas = await Entrada.find({ $where: function () { return (this.estado == false) } }).populate({ path: 'producto', model: 'Producto' }).populate({ path: 'producto', model: 'Producto' });
    } else if (req.params.estado == 'all') {
        entradas = await Entrada.find({});
    }

    res.json(entradas);
}



export const actualizarEntrada = async (req: any, res: Response) => {

     let rs = "";
    let resp: any;
    const { id } = req.params;
     const entr = {
        proveedor: req.body.proveedor,
        producto: req.body.producto,
        referencia: req.body.referencia,
        factura: req.body.factura,
        preciounidad: req.body.preciounidad,
        cantidad: req.body.cantidad,
        observacion: req.body.observacion,
    };

    if (id === 'null' || id === undefined) {  // Insertar nuevo entrada

        const entrada = new Entrada(entr);

        try {
            resp = await entrada.save();
        } catch (err) {
             if(err.code===11000){
                resp = "nombreyaexiste";
            } 
        } 

        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id


        if (id) {
            //  rs = await Entrada.updateOne({ _id: id }, entrada, { upsert: true }); 
            rs = await Entrada.updateOne({ _id: id }, entr);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarEntrada = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Entrada.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarEntradas = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Entrada.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Entradas dados de baja'
    });
};






