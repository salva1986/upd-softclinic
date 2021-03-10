import { Response, Request } from 'express';
import { Salida } from '../models/salida.model';

export const obtenerSalida = (req: any, res: Response) => {
    const salida = req.salida;
    res.json({
        ok: true,
        salida
    });
}

export const verTodos = async (req: any, res: Response) => {
    let salidas = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        salidas = await Salida.find({ $where: function () { return (this.estado == true) } }).populate({path:'producto', model:'Producto'});
    } else if (req.params.estado == "noactivos") {
        salidas = await Salida.find({ $where: function () { return (this.estado == false) } }).populate({path:'producto', model:'Producto'});
    } else if (req.params.estado == 'all') {
        salidas = await Salida.find({}).populate({path:'producto', model:'Producto'});
    }
    res.json(salidas);
}

export const actualizarSalida = async (req: any, res: Response) => {
    let rs = "";
    let resp: any;
    const { id } = req.params;
    const body = req.body;
    if (id === 'null') {  // Insertar nuevo salida
        const salida = new Salida(body);
        await salida.save();
        try {
            resp = await salida.save();
        } catch (err) {
             if(err.code===11000){
                resp = "duplicado";
            } 
        } 
        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id
        if (id) {
            //  rs = await Salida.updateOne({ _id: id }, salida, { upsert: true }); 
            rs = await Salida.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarSalida = async (req: any, res: Response) => {
    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Salida.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarSalidas = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Salida.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Salidas dados de baja'
    });
};
