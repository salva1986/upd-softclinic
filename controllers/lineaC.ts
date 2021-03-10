import { Response, Request } from 'express';
import { Linea } from '../models/linea.model';

export const obtenerLinea = (req: any, res: Response) => {
    const linea = req.linea;
    res.json({
        ok: true,
        linea
    });
}

export const verTodos = async (req: any, res: Response) => {
    let lineas = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        lineas = await Linea.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        lineas = await Linea.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        lineas = await Linea.find({});
    }
    res.json(lineas);
}

export const actualizarLinea = async (req: any, res: Response) => {

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

    if (id === 'null') {  // Insertar nuevo linea

        const linea = new Linea(prod);

        try {
            resp = await linea.save();
        } catch (err) {
             if(err.code===11000){
                resp = "lineayaexiste";
            } 
        } 

        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id


        if (id) {
            //  rs = await Linea.updateOne({ _id: id }, linea, { upsert: true }); 
            rs = await Linea.updateOne({ _id: id }, prod);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarLinea = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Linea.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarLineas = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Linea.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Lineas dados de baja'
    });
};
