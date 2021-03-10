import { Response, Request } from 'express';
import { Factura } from '../models/factura.model';

export const obtenerFactura = (req: any, res: Response) => {
    const factura = req.factura;
    res.json({
        ok: true,
        factura
    });
}

export interface ParamsFiltro {
    estado: string;
    sort: string;
    order: string;
    page: number;
}


export const verTodos = async (req: any, res: Response) => {
    let facturas = {
        total_count: 0,
        items: {}
    };
    //Total de facturas activos - no activos

    let { texto } = req.params;

    if (req.params.estado === 'noactivos') {
        if (texto === 'undefined') {
            facturas.items = await Factura.find({ estado: false }).populate('proveedor', 'nombre').skip((req.params.page - 1) * 15).limit(15).sort({ fechafactura: 1 });
            facturas.total_count = await Factura.countDocuments({ estado: false });
        } else {
            facturas.items = await Factura.find({ $and: [{ $or: [{ referenciafactura: new RegExp(texto, 'i') }] }, { estado: false }] }).populate('proveedor', 'nombre').skip(0).limit(15).sort({ fechafactura: 1 });
            facturas.total_count = Object.keys(facturas.items).length;
        }
    } else if (req.params.estado === "activos" || req.params.estado === 'undefined') {
        if (texto === 'undefined') {

            facturas.items = await Factura.find({ estado: true }).populate('proveedor', 'nombre').skip((req.params.page - 1) * 15).limit(15).sort({ field: 'asc', fechafactura: -1 });
            //facturas.items = await Factura.find({estado: true}).populate('proveedor', 'nombre');
            facturas.total_count = await Factura.countDocuments({ estado: true });
        } else {

            facturas.items = await Factura.find({ $and: [{ $or: [{ referenciafactura: new RegExp(texto, 'i') }] }, { estado: true }] }).populate('proveedor', 'nombre').skip(0).limit(15).sort({ field: 'asc', fechafactura: -1 });
            //facturas.items = await Factura.find({estado: true}).populate('proveedor', 'nombre');
            facturas.total_count = Object.keys(facturas.items).length;
        }
    }

    res.json(facturas);
}

export const verInfofactura = async (req: any, res: Response) => {
    const { factura } = req.params;

    const _factura = await Factura.find({_id: factura, estado:  true}, {fechafactura:1, montofactura:1, referenciafactura:1}).populate('proveedor', 'nombre');
    res.json(_factura);
}




export const actualizarFactura = async (req: any, res: Response) => {
    let rs = "";
    let resp: any;
    const { id } = req.params;
    const { contado, estado, pagada } = req.body;
    contado === 'si' ? req.body.vencimientofactura = 0 : req.body.vencimientofactura;
    pagada == 'pagada' ? req.body.pagada = true : req.body.pagada = false;
    estado == null ? req.body.estado = true : req.body.estado;
    let fechaV = sumarFechas(req.body.vencimientofactura, req.body.fechafactura);
    let factura_ = {};
    if( contado === 'si'){
        factura_ = {
            fechafactura: req.body.fechafactura,
            referenciafactura: req.body.referenciafactura,
            montofactura: req.body.montofactura,
            impuesto: req.body.montofactura * 0.12,
            proveedor: req.body.proveedor,
            contado: req.body.contado,
            vencimientofactura: req.body.vencimientofactura,
            pagada: req.body.pagada,
            nota: req.body.nota
        };
    }else{
        factura_ = {
            fechafactura: req.body.fechafactura,
            referenciafactura: req.body.referenciafactura,
            montofactura: req.body.montofactura,
            impuesto: req.body.montofactura * 0.12,
            proveedor: req.body.proveedor,
            contado: req.body.contado,
            vencimientofactura: req.body.vencimientofactura,
            pagada: req.body.pagada,
            fechavencimientofactura: fechaV,
            nota: req.body.nota
        };
    }
     

    if (id === 'null') {  // Insertar nuevo factura

        const factura = new Factura(factura_);

        await factura.save();
        try {
            resp = await factura.save();
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
            //  rs = await Factura.updateOne({ _id: id }, factura, { upsert: true }); 
            rs = await Factura.updateOne({ _id: id }, factura_);
        }
        res.json({
            rs
        });
    }
};

export const eliminarFactura = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Factura.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarFacturas = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Factura.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Facturas dados de baja'
    });
};


export const sumarFechas = (diasAsumar: string, fechaAmodificar: string) => {
    let dias = diasAsumar || '0';

    let Fecha = new Date(fechaAmodificar);
    var sFecha = (Fecha.getDate() + "/" + (Fecha.getMonth() + 1) + "/" + Fecha.getFullYear());
    //var sep = sFecha.indexOf('-') != -1 ? '/' : '-';
    let sep = "/";
    let aFecha = sFecha.split(sep);
    let fecha = aFecha[2] + '/' + aFecha[1] + '/' + aFecha[0];

    var nFecha = new Date(fecha);
    nFecha.setDate(nFecha.getDate() + parseInt(dias));
    let anno = nFecha.getFullYear();
    let mes: any = nFecha.getMonth() + 1;
    let dia: any = nFecha.getDate();
    //mes = (mes < 10) ? ("0" + mes) : mes;
    //dia = (dia < 10) ? ("0" + dia) : dia;
    var fechaFinal = anno + sep + mes + sep + dia;
    //var fechaFinal = dia + sep + mes + sep +anno;
    return (fechaFinal);
}