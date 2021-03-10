import { Response, Request } from 'express';
import { Requisicion } from '../models/requisicion.model';

export const obtenerRequisicion = (req: any, res: Response) => {
    const requisicion = req.requisicion;
    res.json({
        ok: true,
        requisicion
    });
}

export interface ParamsFiltro {
    estado: string;
    sort: string;
    order: string;
    page: number;
}



export const actualizarRequisicion = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
    const { id } = req.params;
    const body = req.body;
    req.body.unidad = 'farmacia';
    if (id === 'null') {  // Insertar nuevo requisicion
        const requisicion = new Requisicion(body);
        await requisicion.save();
        try {
            resp = await requisicion.save();
        } catch (err) {
            if (err.code === 11000) {
                resp = "registroexiste";
            }
        }
        res.json({
            rs: resp
        });
    } else {// Actualizar si existe id
        if (id) {
            rs = await Requisicion.updateOne({ _id: id, estado: true }, { $set: { estadopedido: body.estadopedido } });
        }
        res.json({
            rs
        });
    }
};

export const eliminarRequisicion = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Requisicion.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarRequisiciones = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Requisicion.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Requisiciones dados de baja'
    });
};


export const verRequisiciones = async (req: any, res: Response) => {
    let requisiciones = {
        total_count: 0,
        items: {}
    };
    //Total de requisiciones activos - no activos
    let { texto, estado } = req.params;
    estado === 'undefined' ? estado = 'consumible' : estado;
    if (texto === 'undefined') {
        requisiciones.items = await Requisicion.find({ estado: true, unidad: estado }).populate('producto', 'nombre stock').skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
        requisiciones.total_count = await Requisicion.countDocuments({ estado: true, unidad: estado });
    } else {
        //requisiciones.items = await Requisicion.find({$and: [{ $or: [{ estadopedido: new RegExp(texto, 'i'),  cantidad: {'$regex': texto} }] }, {estado: true,  unidad: estado}]}).populate('producto', 'nombre stock').skip(0).limit(30).sort({ nombres: 1 });
        requisiciones.items = await Requisicion.find({ $and: [{ $or: [{ estadopedido: { '$regex': texto } }] }, { estado: true, unidad: estado }] }).populate('producto', 'nombre stock').skip(0).limit(30).sort({ nombres: 1 });

        requisiciones.total_count = Object.keys(requisiciones.items).length;
    }

    res.json(requisiciones);
};

export const verRequisicionesPorUnidad = async (req: any, res: Response) => {
    let requisiciones = {
        ortopodologia: 0,
        insumos: 0,
        consumibles: 0,
        farmacia: 0,
    };
    // requisiciones = await Requisicion.aggregate([ { $match: { estadopedido: { $lte: 'En Espera' } } }, {"$group" : {_id:{estado:"$estadopedido",unidad:"$unidad"}, total:{$sum:1}}},{$sort:{"unidad":1}} ])

    requisiciones.ortopodologia = await Requisicion.countDocuments({ estadopedido: 'En Espera', unidad: 'ortopodologia', estado: true });
    requisiciones.insumos = await Requisicion.countDocuments({ estadopedido: 'En Espera', unidad: 'insumo', estado: true });
    requisiciones.consumibles = await Requisicion.countDocuments({ estadopedido: 'En Espera', unidad: 'consumible', estado: true });
    requisiciones.farmacia = await Requisicion.countDocuments({ estadopedido: 'En Espera', unidad: 'farmacia', estado: true });
    res.json(requisiciones);
};






