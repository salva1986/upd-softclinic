import { Response } from 'express';
import { Cita } from '../models/cita.model';

export const verTotales = async (req: any, res: Response) => {
    const fecha = new Date();
    let dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    let totales: any = {
    };

    const totalHoy: any = await Cita.aggregate([
        { $match: { "factura.facturaanulada": { $ne: true } } },
        {
            "$redact": {
                "$cond": [{
                    "$and": [{ "$eq": [{ "$year": "$factura.fecha" }, anio] }, { "$eq": [{ "$month": "$factura.fecha" }, mes] },
                    { "$eq": [{ "$dayOfMonth": "$factura.fecha" }, dia] }]
                }, "$$KEEP", "$$PRUNE"]
            }
        },
        { $group: { _id: null, 'total': { $sum: '$factura.total' }, 'descuento': { $sum: '$factura.descuento' } } }
    ]);

    if (totalHoy[0]) {
        totales.hoy = totalHoy[0].total - totalHoy[0].descuento;
    }

    const totalMes: any = await Cita.aggregate([
        { $match: { "factura.facturaanulada": { $ne: true } } },
        { "$redact": { "$cond": [{ "$and": [{ "$eq": [{ "$year": "$factura.fecha" }, anio] }, { "$eq": [{ "$month": "$factura.fecha" }, mes] }] }, "$$KEEP", "$$PRUNE"] } },
        { $group: { _id: null, 'total': { $sum: '$factura.total' }, 'descuento': { $sum: '$factura.descuento' } } }
    ]);
    //  console.log("total", totalMes[0].total, "descuento ", totalMes[0].descuento);

    if (totalMes[0]) {
        totales.mes = totalMes[0].total - totalMes[0].descuento;
    }
    res.json(totales);
}

export const verReportesFecha = async (req: any, res: Response) => {
    const page = Number.parseFloat(req.params.page);
    let fechainicio = new Date(req.params.fechainicio);
    let fechafin = new Date(req.params.fechafin);

    const anio = fechainicio.getFullYear();
    const mes = fechainicio.getMonth() + 1;
    const hoy = fechainicio.getDate();

    const anio2 = fechafin.getFullYear();
    const mes2 = fechafin.getMonth() + 1;
    const hoy2 = fechafin.getDate();

    const fechainicio2 = new Date(`${anio}-${mes}-${hoy}`);
    const fechafin2 = new Date(`${anio2}-${mes2}-${hoy2}`);

    //console.log('fechainicio2 ', fechainicio2);
    //console.log('fechafin2 ', fechafin2);

    let facturas = {
        total_count: 0,
        items: {}
    };
    facturas.items = await Cita.find({ estado: true, finalizada: true, "factura.fecha": { "$gte": fechainicio2, "$lte": fechafin2 } }, { factura: 1, unidad: 1 }).sort({ 'factura.nofactura': 1 }).populate({ path: 'paciente', model: 'Paciente' }).skip((page - 1) * 15).limit(15);
    facturas.total_count = await Cita.countDocuments({ estado: true, finalizada: true, "factura.facturaanulada": { $ne: true }, "factura.fecha": { "$gte": fechainicio2, "$lte": fechafin2 } });

    res.json(facturas);
}


export const verReportesAll = async (req: any, res: Response) => {
    let fechainicio = new Date(req.params.fechainicio);
    let fechafin = new Date(req.params.fechafin);

    const anio = fechainicio.getFullYear();
    const mes = fechainicio.getMonth() + 1;
    const hoy = fechainicio.getDate();

    const anio2 = fechafin.getFullYear();
    const mes2 = fechafin.getMonth() + 1;
    const hoy2 = fechafin.getDate();

    const fechainicio2 = new Date(`${anio}-${mes}-${hoy}`);
    const fechafin2 = new Date(`${anio2}-${mes2}-${hoy2}`);
    /* console.log('fechainicio2 ', fechainicio2);
    console.log('fechafin2 ', fechafin2); */
    

    const facturas = await Cita.find({ estado: true, finalizada: true, "factura.facturaanulada": { $ne: true }, "factura.fecha": { "$gte": fechainicio2, "$lte": fechafin2 } }, { factura: 1, unidad: 1 }).sort({ 'factura.nofactura': 1 }).populate({ path: 'paciente', model: 'Paciente' });

    res.json(facturas);

}

export const verProductosCita = async (req: any, res: Response) => {
    let fechainicio = new Date(req.params.fechainicio);
    let fechafin = new Date(req.params.fechafin);

    const anio = fechainicio.getFullYear();
    const mes = fechainicio.getMonth() + 1;
    const hoy = fechainicio.getDate();

    const anio2 = fechafin.getFullYear();
    const mes2 = fechafin.getMonth() + 1;
    const hoy2 = fechafin.getDate();

    const fechainicio2 = new Date(`${anio}-${mes}-${hoy}`);
    const fechafin2 = new Date(`${anio2}-${mes2}-${hoy2}`);
    const cita = await Cita.find({ estado: true, finalizada: true, "factura.facturaanulada": { $ne: true }, "factura.fecha": { "$gte": fechainicio2, "$lte": fechafin2 } })
        .populate({ path: 'paciente', model: 'Paciente' })
        .populate({ path: 'servicios.id', model: 'Servicio', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } })
        .populate({ path: 'consumibles.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } })
        .populate({ path: 'insumos.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } })
        .populate({ path: 'productos.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } })
        .populate({ path: 'ortopodologia.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'cantidad': 1, 'precio': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } });
    res.json(cita);
}

//https://stackoverflow.com/questions/57164135/mongodb-double-nested-array-to-reserve-unwind
//https://stackoverflow.com/questions/29195272/mongodb-aggregation-unwind-more-than-one-array

/* const moment = require('moment')

const today = moment().startOf('day')

MyModel.find({
  createdAt: {
    $gte: today.toDate(),
    $lte: moment(today).endOf('day').toDate()
  }
}) */