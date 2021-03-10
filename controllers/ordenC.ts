import { Response, Request } from 'express';
import { Orden } from '../models/orden.model';

export const obtenerOrden = (req: any, res: Response) => {
    const orden = req.orden;
    res.json({
        ok: true,
        orden
    });
}

export interface ParamsFiltro {
    estado: string;
    sort: string;
    order: string;
    page: number;
}


export const verTodos = async (req: any, res: Response) => {
    let ordenes = {
        total_count: 0,
        items: {}
    };
    //Total de ordenes activos - no activos
    let { texto } = req.params;

    if (req.params.estado === 'noactivos') {
        if (texto === 'undefined') {
            ordenes.items = await Orden.find({estado: false}).skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            ordenes.total_count = await Orden.countDocuments({estado: false});
        } else {
          ordenes.items = await Orden.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i'), hc: new RegExp(texto, 'i') }] }, {estado: false}]}).skip(0).limit(30).sort({ nombres: 1 });
          //ordenes.total_count = await Orden.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, {estado: false}]}).skip(0).limit(30).countDocuments({});
          ordenes.total_count  = Object.keys(ordenes.items).length;
        }
    } else  if (req.params.estado === "activos" || req.params.estado === 'undefined') {
         if (texto === 'undefined') {
            ordenes.items = await Orden.find({estado: true}).skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            ordenes.total_count = await Orden.countDocuments({estado: true});
        } else {
            ordenes.items = await Orden.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, {estado: true}]}).skip(0).limit(30).sort({ nombres: 1 });
          
            ordenes.total_count  = Object.keys(ordenes.items).length;
        } 
    }
    res.json(ordenes);
}


export const actualizarOrden = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
    const { id } = req.params;
    const body = req.body;
    if (id === 'null') {  // Insertar nuevo orden
        const orden = new Orden(body);
        await orden.save();
        try {
            resp = await orden.save();
        } catch (err) {
            if (err.code === 11000) {
                resp = "correoexiste";
            }
        }
        res.json({
            rs: resp
        });
    } else {// Actualizar si existe id
        if (id) {
            //  rs = await Orden.updateOne({ _id: id }, orden, { upsert: true }); 
            rs = await Orden.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    }
};

export const eliminarOrden = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Orden.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarOrdenes = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Orden.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Ordenes dados de baja'
    });
};
