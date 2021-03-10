import { Response, Request } from 'express';
import { Casa } from '../models/casa.model';

export const obtenerCasa = (req: any, res: Response) => {
    const casa = req.casa;
    res.json({
        ok: true,
        casa
    });
}

export const verTodos = async (req: any, res: Response) => {
    let casas = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        casas = await Casa.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        casas = await Casa.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        casas = await Casa.find({});
    }
    res.json(casas);
}

export const actualizarCasa = async (req: any, res: Response) => {

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

    if (id === 'null') {  // Insertar nuevo casa

        const casa = new Casa(prod);

        try {
            resp = await casa.save();
        } catch (err) {
            console.log(err);
             if(err.code===11000){
                resp = "casayaexiste";
            } 
        } 

        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id


        if (id) {
            //  rs = await Casa.updateOne({ _id: id }, casa, { upsert: true }); 
            rs = await Casa.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarCasa = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Casa.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarCasas = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Casa.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Casas dados de baja'
    });
};
