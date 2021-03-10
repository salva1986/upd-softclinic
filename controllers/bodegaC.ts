import { Response, Request } from 'express';
import { Bodega } from '../models/bodega.model';

export const obtenerBodega = (req: any, res: Response) => {
    const bodega = req.bodega;
    res.json({
        ok: true,
        bodega
    });
}

export const verTodos = async (req: any, res: Response) => {
    let bodegas = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        bodegas = await Bodega.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        bodegas = await Bodega.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        bodegas = await Bodega.find({});
    }

    res.json(bodegas);
}

export const actualizarBodega = async (req: any, res: Response) => {
    let rs = "";
    let resp: any;
    const { id } = req.params;
    const body = req.body;
    if (id === 'null') {  // Insertar nuevo bodega

        const bodega = new Bodega(body);

        await bodega.save();
        try {
            resp = await bodega.save();
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
            //  rs = await Bodega.updateOne({ _id: id }, bodega, { upsert: true }); 
            rs = await Bodega.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarBodega = async (req: any, res: Response) => {
    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Bodega.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarBodegas = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Bodega.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Bodegas dados de baja'
    });
};
