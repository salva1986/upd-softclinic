import { Response, Request } from 'express';
import { Requisicion } from '../models/requisicion.model';
import { Producto } from '../models/producto.model';
import { Stock } from '../models/stock.model';

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


export const verTodos = async (req: any, res: Response) => {
    let requisiciones = {
        total_count: 0,
        items: {}
    };
    //Total de requisiciones activos - no activos
    let { texto } = req.params;

    if (req.params.estado === 'noactivos') {
        /*         if (texto === 'undefined') {
                    requisiciones.items = await Requisicion.find({estado: false, unidad: 'ortopodologia'}).populate('producto', 'nombre, stock').skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
                    requisiciones.total_count = await Requisicion.countDocuments({estado: false});
                } else {
                  requisiciones.items = await Requisicion.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i'), hc: new RegExp(texto, 'i') }] }, {estado: false, unidad: 'ortopodologia'}]}).populate('producto', 'nombrestock').skip(0).limit(30).sort({ nombres: 1});
        
                  requisiciones.total_count  = Object.keys(requisiciones.items).length;
                } */
    } else if (req.params.estado === "activos" || req.params.estado === 'undefined') {
        if (texto === 'undefined') {
           // requisiciones.items = await Requisicion.find({ estado: true, unidad: 'ortopodologia' }).populate('producto', 'nombre stock').skip((req.params.page - 1) * 30).limit(30).sort({ estadopedido: 1 });
           requisiciones.items = await Requisicion.find({ estado: true, unidad: 'ortopodologia' }).populate('producto', 'nombre stock').skip((req.params.page - 1) * 30).limit(30).sort({ field: 'asc', fechapedido: 1 });
            requisiciones.total_count = await Requisicion.countDocuments({ estado: true, unidad: 'ortopodologia' });
        } else {
           // requisiciones.items = await Requisicion.find({ $and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, { estado: true, unidad: 'ortopodologia' }] }).populate('producto', 'nombre stock').skip(0).limit(30).sort({ estadopedido: 1 });
           requisiciones.items = await Requisicion.find({ $and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, { estado: true, unidad: 'ortopodologia' }] }).populate('producto', 'nombre stock').skip(0).limit(30).sort({ field: 'asc', fechapedido: 1 });

            requisiciones.total_count = Object.keys(requisiciones.items).length;
        }
    }
    res.json(requisiciones);
}


export const actualizarRequisicion = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
    const { id } = req.params;
    const body = req.body;
    req.body.unidad = 'ortopodologia';
    if (id === 'null') {  // Insertar nuevo requisicion
        const requisicion = new Requisicion(body);
        await requisicion.save();
        try {
            resp = await requisicion.save();
        } catch (err) {
            if (err.code === 11000) {
                resp = "registroexistente";
            }
        }
        res.json({
            rs: resp
        });
    } else {// Actualizar si existe id
        if (id) {
            rs = await Requisicion.updateOne({ _id: id }, body);
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
        rs = await Requisicion.updateOne({ _id: id, estadopedido: 'En Espera' }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarRequisiciones = async (req: any, res: Response) => {

    /*  let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
     estado = !estado;
 
     await Requisicion.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
     res.json({
         'status': 'Requisiciones dados de baja'
     }); */
};
export const finalizarRequisicion = async (req: any, res: Response) => {
    const { id } = req.body;

    let idproducto = '';
    let _cantidad = 0;
    const prod = await Requisicion.find({ _id: id, estadopedido: 'Aceptado' }, { producto: 1, cantidad: 1 });


    const rs = await Requisicion.updateOne({ _id: id, estadopedido: 'Aceptado' }, { $set: { estadopedido: 'Finalizado', fechafinalizacion:  new Date() } });
    if (rs.nModified) {
        idproducto = prod[0].producto;
        _cantidad = prod[0].cantidad;
        let restar = await Producto.updateOne({ _id: idproducto },  { $inc: { stock: _cantidad * -1,  stockortopodologia: _cantidad } }); //Descargar de Bodega Central
        //await Producto.updateOne({ _id: idproducto }, {$set: { $inc: {stockortopodologia: _cantidad } }}); //Descargar de Bodega Central
                                                                                                     
        if(restar.nModified){ //Cargar productos a stock de cada unidad
            await Stock.updateOne({ unidad: 'ortopodologia' }, { $push: { entradas: {producto: idproducto, cantidad: _cantidad} }, $inc: { stock: _cantidad } });
        }
    }

    res.json({
        rs
    });
};



