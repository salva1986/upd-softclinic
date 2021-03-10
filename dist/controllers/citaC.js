"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cita_model_1 = require("../models/cita.model");
const producto_model_1 = require("../models/producto.model");
const dte_1 = require("../classes/dte");
const moment = require("moment");
exports.obtenerCita = (req, res) => {
    const cita = req.cita;
    res.json({
        ok: true,
        cita
    });
};
let emisor = {
    codigomoneda: 'GTQ',
    //fechaemision: fecha,
    //tipodocumento: 'FACT',
    fechaemision: '',
    tipodocumento: '',
    //Datos Generales
    tipoafiliacion: 'GEN',
    codigoestablecimiento: 1,
    correoemisor: 'info@upd.com.gt',
    nitemisor: '40972828',
    nombrecomercial: 'PREPAGAS MEDICAS, S.A.',
    nombreemisor: 'PREPAGAS MEDICAS, S.A.',
    //Dirección
    direccion: 'Kilómetro 8 Carretera a El Salvador, Casa No. 6 Lotificación Lomas Altas 1',
    codigopostal: '01001',
    municipio: 'GUATEMALA',
    departamento: 'GUATEMALA',
    pais: 'GT',
};
const crearDTE = (idcita, estado, tipoDTE, observaciones) => __awaiter(void 0, void 0, void 0, function* () {
    let fecha = moment().format();
    let emisorDTE = emisor;
    emisorDTE.fechaemision = fecha;
    emisorDTE.tipodocumento = tipoDTE;
    let codigoescenario = 0;
    let cita;
    const id = idcita;
    cita = yield cita_model_1.Cita.findById(id).populate({ path: 'paciente', model: 'Paciente' }).populate({ path: 'servicios.id', model: 'Servicio' }).populate({ path: 'consumibles.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } }).populate({ path: 'insumos.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } }).populate({ path: 'productos.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } }).populate({ path: 'ortopodologia.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } });
    //res.json(cita);
    cita['servicios'].length > 0 ? codigoescenario = codigoescenario + cita['servicios'].length : codigoescenario;
    cita['insumos'].length > 0 ? codigoescenario = codigoescenario + cita['insumos'].length : codigoescenario;
    cita['productos'].length > 0 ? codigoescenario = codigoescenario + cita['productos'].length : codigoescenario;
    cita['ortopodologia'].length > 0 ? codigoescenario = codigoescenario + cita['ortopodologia'].length : codigoescenario;
    const factura = cita.factura;
    if (cita.factura.correo === '' || cita.factura.correo.length < 7) {
        cita.factura.correo = '';
    }
    let receptor = {
        codigopostal: '01001',
        correoreceptor: 'facturacion@upd.com.gt;' + cita.factura.correo,
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        direccion: cita.factura.direccion,
        //nitreceptor: cita.factura.nit.replace('-', ''),
        nitreceptor: cita.factura.nit.replace(/-| /gi, ''),
        nombrereceptor: cita.factura.nombre,
        idreceptor: cita.paciente._id,
        paciente: cita.paciente.nombres,
        codigofactura: cita._id,
        pais: 'GT'
    };
    let items = {
        servicios: cita['servicios'] || '',
        insumos: cita['insumos'] || '',
        productos: cita['productos'] || '',
        ortopodologia: cita['ortopodologia'] || '',
        servicioscodigo: '1234567890',
        insumoscodigo: '5da95ae782dfce60e848cbdb',
        productoscodigo: '5da95adb82dfce60e848cbda',
        ortopodologiacodigo: '5da95b1182dfce60e848cbdd',
        codigoescenario
    };
    const fel = new dte_1.DOCTRIBUTARIOELECTRONICO();
    let resp = '';
    //verificar que factura esté finalizada 
    if (emisorDTE.tipodocumento === 'FACT') {
        resp = yield fel.crearXMLFactura(emisorDTE, receptor, items, id, factura, estado);
    }
    else if (emisorDTE.tipodocumento === 'NCRE') {
        const observacionescredito = observaciones;
        resp = yield fel.crearXMLNCREDITO(emisorDTE, receptor, items, id, factura, estado, observacionescredito);
    }
    else if (emisorDTE.tipodocumento === 'NDEB') {
        const observacionesdebito = observaciones;
        resp = yield fel.crearXMLNDEBITO(emisorDTE, receptor, items, id, factura, estado, observacionesdebito);
    }
    return resp;
});
const crearDTEAnulacion = (idcita, estado, tipoDTE, observaciones) => __awaiter(void 0, void 0, void 0, function* () {
    let fecha = moment().format();
    let emisorDTE = emisor;
    emisorDTE.fechaemision = fecha;
    emisorDTE.tipodocumento = tipoDTE;
    let cita;
    const id = idcita;
    cita = yield cita_model_1.Cita.findById(id).populate({ path: 'paciente', model: 'Paciente' });
    //res.json(cita);
    const factura = cita.factura;
    if (cita.factura.correo === '' || cita.factura.correo.length < 7) {
        cita.factura.correo = '';
    }
    let receptor = {
        codigopostal: '01001',
        correoreceptor: 'facturacion@upd.com.gt;' + cita.factura.correo,
        // correoreceptor: 'manuel.mndz13@gmail.com' + ';facturacion@upd.com.gt;' + cita.factura.correo + ";edesalto@gmail.com",
        departamento: 'Guatemala',
        municipio: 'Guatemala',
        direccion: cita.factura.direccion,
        //nitreceptor: cita.factura.nit.replace('-', ''),
        nitreceptor: cita.factura.nit.replace(/-| /gi, ''),
        nombrereceptor: cita.factura.nombre,
        idreceptor: cita.paciente._id,
        paciente: cita.paciente.nombres,
        codigofactura: cita._id,
        pais: 'GT'
    };
    const fel = new dte_1.DOCTRIBUTARIOELECTRONICO();
    let resp = '';
    const motivoanulacion = observaciones;
    resp = yield fel.crearXMLANULACIONDTE(emisorDTE, receptor, id, factura, motivoanulacion);
    return resp;
});
exports.imprimirFEL = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = req.params.uuid;
    const fel = new dte_1.DOCTRIBUTARIOELECTRONICO();
    const resp = yield fel.imprimirDTE(uuid);
    res.json({
        resp: resp
    });
});
exports.verCitaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const cita = yield cita_model_1.Cita.findById(id).populate({ path: 'paciente', model: 'Paciente' }).populate({ path: 'servicios.id', model: 'Servicio' }).populate({ path: 'consumibles.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } }).populate({ path: 'insumos.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } }).populate({ path: 'productos.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } }).populate({ path: 'ortopodologia.id', model: 'Producto', select: { '_id': 1, 'nombre': 1, 'nombremostrar': 1, 'precioventacaja': 1, 'descripcion': 1 } });
    res.json(cita);
});
exports.verCalendarioCitas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filtrados;
    let citas = {
        total_count: 0,
        items: {}
    };
    const fechaInicio = req.params.fechaInicio;
    const fechaFin = req.params.fechaFin;
    citas.items = yield cita_model_1.Cita.find({ "fecha": { "$gte": new Date(fechaInicio), "$lt": new Date(fechaFin) } }).populate({ path: 'paciente', model: 'Paciente' }).skip((req.params.page - 1) * 30).limit(30).sort({ fecha: 1, hora: 1, nombres: 1 });
    citas.total_count = yield cita_model_1.Cita.countDocuments({ estado: true });
    res.json(citas);
});
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filtrados = [];
    let citas = {
        total_count: 0,
        items: {}
    };
    if (req.params.estado === 'undefined') {
        req.params.estado = 'hoy';
    }
    if (req.params.texto === 'undefined') {
        req.params.texto = '';
    }
    req.params.texto = req.params.texto.trim();
    let { texto } = req.params;
    let { estado } = req.params;
    if (estado === 'hoy') {
        const fechahoy = new Date();
        let day = fechahoy.getDate();
        let month = fechahoy.getMonth() + 1;
        let year = fechahoy.getFullYear();
        let fechaactual = new Date(`${year}-${month}-${day}`);
        let fechafin = new Date(`${year}-${month}-${day + 1}`);
        if (texto === '') {
            citas.items = yield cita_model_1.Cita.aggregate([{ $match: { fecha: { $gte: new Date(fechaactual), $lte: new Date(fechafin) }, estado: true, finalizada: false } },
                { $lookup: { from: 'pacientes', 'localField': 'paciente', 'foreignField': '_id', as: 'paciente' } },
                { '$unwind': '$paciente' }]).skip((req.params.page - 1) * 30).limit(30).sort({ fecha: 1, hora: 1, nombres: 1 });
            filtrados = yield cita_model_1.Cita.aggregate([{ $match: { fecha: { $gte: new Date(fechaactual), $lte: new Date(fechafin) }, estado: true, finalizada: false } }, { $group: { _id: null, count: { $sum: 1 } } }]);
            if (filtrados[0]) {
                citas.total_count = filtrados[0].count;
            }
            else {
                citas.total_count = 0;
            }
        }
        else {
            citas.items = yield cita_model_1.Cita.aggregate([{ $match: { fecha: { $gte: new Date(fechaactual), $lte: new Date(fechafin) }, estado: true, finalizada: false } },
                { $lookup: { from: 'pacientes', 'localField': 'paciente', 'foreignField': '_id', as: 'paciente' } },
                { '$unwind': '$paciente' }, { $match: { $or: [{ 'factura.nofactura': new RegExp(texto, 'i') }, { 'paciente.nombres': new RegExp(texto, 'i') }, { 'paciente.hc': new RegExp(texto, 'i') }, { 'paciente.telefono': new RegExp(texto, 'i') }] } }]).skip((req.params.page - 1) * 30).limit(30).sort({ fecha: 1, hora: 1, nombres: 1 });
            filtrados = yield cita_model_1.Cita.aggregate([{ $match: { fecha: { $gte: new Date(fechaactual), $lte: new Date(fechafin) } } }, { $group: { _id: null, count: { $sum: 1 } } }]);
            citas.total_count = Object.keys(citas.items).length;
        }
    }
    else if (estado === 'pendientes') {
        if (texto === '') {
            citas.items = yield cita_model_1.Cita.find({ estado: true, finalizada: false }).populate({ path: 'paciente', model: 'Paciente' }).skip((req.params.page - 1) * 30).limit(30).sort({ fecha: -1, hora: -1, nombres: 1 });
            citas.total_count = yield cita_model_1.Cita.countDocuments({ estado: true, finalizada: false });
        }
        else {
            citas.items = yield cita_model_1.Cita.aggregate([{ $match: { estado: true, finalizada: false } },
                { $lookup: { from: 'pacientes', 'localField': 'paciente', 'foreignField': '_id', as: 'paciente' } },
                { '$unwind': '$paciente' },
                { $match: { $or: [{ 'factura.nofactura': new RegExp(texto, 'i') }, { 'paciente.nombres': new RegExp(texto, 'i') }, { 'paciente.hc': new RegExp(texto, 'i') }, { 'paciente.telefono': new RegExp(texto, 'i') }] } }])
                .skip((req.params.page - 1) * 30)
                .limit(30)
                .sort({ fecha: 1, hora: 1, nombres: 1 });
            citas.total_count = Object.keys(citas.items).length;
        }
    }
    else if (estado === "finalizadas") {
        if (texto === '') {
            citas.items = yield cita_model_1.Cita.find({ estado: true, finalizada: true }).populate({ path: 'paciente', model: 'Paciente' }).skip((req.params.page - 1) * 30).limit(30).sort({ fecha: -1, hora: -1, nombres: 1 });
            citas.total_count = yield cita_model_1.Cita.countDocuments({ estado: true, finalizada: true });
        }
        else {
            citas.items = yield cita_model_1.Cita.aggregate([{ $match: { estado: true, finalizada: true } },
                { $lookup: { from: 'pacientes', 'localField': 'paciente', 'foreignField': '_id', as: 'paciente' } },
                { '$unwind': '$paciente' }, { $match: { $or: [{ 'factura.nofactura': new RegExp(texto, 'i') }, { 'paciente.nombres': new RegExp(texto, 'i') }, { 'paciente.hc': new RegExp(texto, 'i') }, { 'paciente.telefono': new RegExp(texto, 'i') }] } }]).skip((req.params.page - 1) * 30).limit(30).sort({ fecha: 1, hora: 1, nombres: 1 });
            citas.total_count = Object.keys(citas.items).length;
        }
    }
    else if (estado === "eliminadas") {
        if (texto === '') {
            citas.items = yield cita_model_1.Cita.find({ estado: false }).populate({ path: 'paciente', model: 'Paciente' }).skip((req.params.page - 1) * 30).limit(30).sort({ fecha: -1, hora: -1, nombres: 1 });
            citas.total_count = yield cita_model_1.Cita.countDocuments({ estado: false });
        }
        else {
            citas.items = yield cita_model_1.Cita.aggregate([{ $match: { estado: false } },
                { $lookup: { from: 'pacientes', 'localField': 'paciente', 'foreignField': '_id', as: 'paciente' } },
                { '$unwind': '$paciente' }, { $match: { $or: [{ 'factura.nofactura': new RegExp(texto, 'i') }, { 'paciente.nombres': new RegExp(texto, 'i') }, { 'paciente.hc': new RegExp(texto, 'i') }, { 'paciente.telefono': new RegExp(texto, 'i') }] } }]).skip((req.params.page - 1) * 30).limit(30).sort({ fecha: 1, hora: 1, nombres: 1 });
            citas.total_count = Object.keys(citas.items).length;
        }
    }
    res.json(citas);
});
/* db.getCollection('citas').aggregate([
    // join Recipes collection
    {
        $lookup: {
            from: 'pacientes',
            localField: 'paciente',
            foreignField: '_id',
            as: 'PACIENTE'
        }
    },
    // convert array of Recipe to object
    {
        $unwind: '$PACIENTE'
    },
    // filter
    {
        $match: {
            'PACIENTE.nombres': 'ADALBERTA  AVILA '
        }
    }
]); */
exports.actualizarCita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    let body = req.body;
    const fechacita = new Date(req.body.fecha);
    if (id === 'null') { // Insertar nuevo cita
        req.body.factura = {
            nombre: '',
            nit: '',
            direccion: '',
            metodopago: {
                metodo: '',
                efectivo: 0,
                tarjeta: 0,
                transferencia: 0,
            },
            total: 0
        };
        req.body.notacredito = {
            nonotacredito: '',
            uuid: '',
            notacreditoemitida: false
        },
            req.body.notadebito = {
                nonotadebito: '',
                uuid: '',
                notadebitoemitida: false
            };
        const cita = new cita_model_1.Cita(body);
        yield cita.save();
        try {
            resp = yield cita.save();
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "correoexiste";
            }
        }
        res.json({
            rs: resp
        });
    }
    else { // Actualizar si existe id
        if (id) {
            //  rs = await Cita.updateOne({ _id: id }, cita, { upsert: true }); 
            rs = yield cita_model_1.Cita.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    }
});
exports.actualizarCitaAgregarServicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const { id } = req.params;
    const body = req.body;
    //body.descuento = 0;
    if (id) {
        //  rs = await Cita.updateOne({ _id: id }, cita, { upsert: true }); 
        rs = yield cita_model_1.Cita.updateOne({ _id: id, estado: true, finalizada: false }, { $push: { servicios: body } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaEliminarServicio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const idCita = req.params.idCita;
    const id = req.params.id;
    // Actualizar si existe id
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: idCita, estado: true, finalizada: false }, { $pull: { servicios: { _id: id } } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaAgregarConsumible = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const { id } = req.params;
    const body = req.body;
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: id, estado: true, finalizada: false }, { $push: { consumibles: body } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaEliminarConsumible = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const idCita = req.params.idCita;
    const id = req.params.id;
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: idCita, estado: true, finalizada: false }, { $pull: { consumibles: { _id: id } } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaAgregarInsumo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const { id } = req.params;
    const body = req.body;
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: id, estado: true, finalizada: false }, { $push: { insumos: body } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaEliminarInsumo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const idCita = req.params.idCita;
    const id = req.params.id;
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: idCita, estado: true, finalizada: false }, { $pull: { insumos: { _id: id } } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaAgregarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const { id } = req.params;
    const body = req.body;
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: id, estado: true, finalizada: false }, { $push: { productos: body } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaEliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const idCita = req.params.idCita;
    const id = req.params.id;
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: idCita, estado: true, finalizada: false }, { $pull: { productos: { _id: id } } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaAgregarOrtopodologia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const { id } = req.params;
    const body = req.body;
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: id, estado: true, finalizada: false }, { $push: { ortopodologia: body } });
    }
    res.json({
        rs
    });
});
exports.actualizarCitaEliminarOrtopodologia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    const idCita = req.params.idCita;
    const id = req.params.id;
    if (id) {
        rs = yield cita_model_1.Cita.updateOne({ _id: idCita, estado: true, finalizada: false }, { $pull: { ortopodologia: { _id: id } } });
    }
    res.json({
        rs
    });
});
exports.eliminarCita = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield cita_model_1.Cita.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarCitas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield cita_model_1.Cita.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Citas dados de baja'
    });
});
exports.guardarDatosFacturacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.metodopago.metodo == 'efectivo') {
        req.body.metodopago.tarjeta = 0;
        req.body.metodopago.cheque = 0;
        req.body.metodopago.transferencia = 0;
        req.body.metodopago.efectivo = req.body.total;
    }
    else if (req.body.metodopago.metodo == 'tarjeta') {
        req.body.metodopago.efectivo = 0;
        req.body.metodopago.cheque = 0;
        req.body.metodopago.tarjeta = req.body.total;
    }
    else if (req.body.metodopago.metodo == 'cheque') {
        req.body.metodopago.efectivo = 0;
        req.body.metodopago.tarjeta = 0;
        req.body.metodopago.transferencia = 0;
        req.body.metodopago.cheque = req.body.total;
    }
    else if (req.body.metodopago.metodo == 'transferencia') {
        req.body.metodopago.efectivo = 0;
        req.body.metodopago.tarjeta = 0;
        req.body.metodopago.cheque = 0;
        req.body.metodopago.transferencia = req.body.total;
    }
    //console.log(Date());
    //console.log(moment().format());
    let factura = {
        nombre: req.body.nombre,
        nit: req.body.nit.trim(),
        direccion: req.body.direccion,
        metodopago: {
            metodo: req.body.metodopago.metodo,
            tarjeta: req.body.metodopago.tarjeta,
            efectivo: req.body.metodopago.efectivo,
            cheque: req.body.metodopago.cheque,
            transferencia: req.body.metodopago.transferencia
        },
        descuento: req.body.descuento,
        nofactura: req.body.nofactura,
        uuid: '',
        total: req.body.total,
        fecha: Date(),
        correo: req.body.correo,
        observaciones: req.body.observaciones,
        facturaanulada: false,
    };
    let resp;
    if (factura.total === 0) {
        res.json({ 'nModified': 0 });
    }
    else {
        const { cita } = req.params;
        if (factura.nit === '0' || factura.nit.toLowerCase() === 'c/f' || factura.nit.toLowerCase() === 'cf' || factura.nit === '') {
            factura.nit = 'CF';
        }
        /***********************************************/
        let facturaTotales = 0;
        let facturaDescuento = 0;
        let _cita;
        _cita = yield cita_model_1.Cita.findById(cita).populate({ path: 'servicios.id', model: 'Servicio' }).populate({ path: 'consumibles.id', model: 'Producto', select: { '_id': 1, 'precioventacaja': 1, } }).populate({ path: 'insumos.id', model: 'Producto', select: { '_id': 1, 'precioventacaja': 1 } }).populate({ path: 'productos.id', model: 'Producto', select: { '_id': 1, 'precioventacaja': 1 } }).populate({ path: 'ortopodologia.id', model: 'Producto', select: { '_id': 1, 'precioventacaja': 1 } });
        let items = {
            servicios: _cita['servicios'] || '',
            insumos: _cita['insumos'] || '',
            productos: _cita['productos'] || '',
            ortopodologia: _cita['ortopodologia'] || '',
        };
        //Servicios
        if (items.servicios.length > 0) {
            let totalServiciosQ = 0;
            let totalDescuento = 0;
            items.servicios.forEach((elemento) => {
                totalServiciosQ = totalServiciosQ + (elemento.precio * elemento.cantidad);
                totalDescuento = totalDescuento + elemento.descuento;
            });
            facturaDescuento = totalDescuento;
            //facturaTotales = facturaTotales + totalServiciosQ - totalDescuento;
            facturaTotales = facturaTotales + totalServiciosQ;
        }
        //Productos
        if (items.productos.length > 0) {
            let totalProductoQ = 0;
            let cantidadProductos = 0;
            items.productos.forEach((elemento) => {
                cantidadProductos = cantidadProductos + elemento.cantidad;
                totalProductoQ = totalProductoQ + (elemento.precio * elemento.cantidad);
            });
            facturaTotales = facturaTotales + totalProductoQ;
        }
        //Ortopodología
        if (items.ortopodologia.length > 0) {
            let totalOrtopodologiaQ = 0;
            let cantidadOrtopodologia = 0;
            items.ortopodologia.forEach((elemento) => {
                totalOrtopodologiaQ = totalOrtopodologiaQ + (elemento.precio * elemento.cantidad);
                cantidadOrtopodologia = cantidadOrtopodologia + elemento.cantidad;
            });
            facturaTotales = facturaTotales + totalOrtopodologiaQ;
        }
        //Insumos
        if (items.insumos.length > 0) {
            let totalInsumosQ = 0;
            let cantidadInsumos = 0;
            items.insumos.forEach((elemento) => {
                totalInsumosQ = totalInsumosQ + (elemento.precio * elemento.cantidad);
                cantidadInsumos = cantidadInsumos + elemento.cantidad;
            });
            facturaTotales = facturaTotales + totalInsumosQ;
        }
        factura.descuento = facturaDescuento;
        factura.total = facturaTotales;
        /***********************************************/
        yield cita_model_1.Cita.updateOne({ _id: cita, finalizada: false }, { 'factura.nit': factura.nit, 'factura.nombre': factura.nombre, 'factura.correo': factura.correo, 'factura.direccion': factura.direccion }, {
            upsert: true
        });
        const tipoDTE = 'FACT';
        let respFEL = yield crearDTE(cita, true, tipoDTE, '');
        respFEL = JSON.parse(respFEL);
        if (respFEL['resultado'] === true) {
            factura.nofactura = respFEL['numero'];
            factura.uuid = respFEL['uuid'];
            resp = yield cita_model_1.Cita.updateOne({ _id: cita, finalizada: false }, { factura: factura, finalizada: true }, {
                upsert: true
            });
            if (resp.nModified) {
                yield cita_model_1.Cita.find({ _id: cita }, { consumibles: 1 }).then((resp) => {
                    resp[0].consumibles.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                        yield producto_model_1.Producto.updateOne({ _id: require('mongoose').Types.ObjectId(element.id) }, { $inc: { stockconsumible: Number(element.cantidad) * -1 } });
                    }));
                });
                yield cita_model_1.Cita.find({ _id: cita }, { insumos: 1 }).then((resp) => {
                    resp[0].insumos.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                        yield producto_model_1.Producto.updateOne({ _id: require('mongoose').Types.ObjectId(element.id) }, { $inc: { stockinsumo: Number(element.cantidad) * -1 } });
                    }));
                });
                yield cita_model_1.Cita.find({ _id: cita }, { productos: 1 }).then((resp) => {
                    resp[0].productos.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                        yield producto_model_1.Producto.updateOne({ _id: require('mongoose').Types.ObjectId(element.id) }, { $inc: { stockfarmacia: Number(element.cantidad) * -1 } });
                    }));
                });
                yield cita_model_1.Cita.find({ _id: cita }, { ortopodologia: 1 }).then((resp) => {
                    resp[0].ortopodologia.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                        yield producto_model_1.Producto.updateOne({ _id: require('mongoose').Types.ObjectId(element.id) }, { $inc: { stockortopodologia: Number(element.cantidad) * -1 } });
                    }));
                });
            }
            res.json(resp);
        }
        else {
            res.json({ 'nModified': 0 });
        }
    }
});
exports.emitirNotaCredito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    let tipoDTE = 'NCRE';
    const { cita } = req.params;
    const observacionesdte = req.body;
    let respFEL = yield crearDTE(cita, true, tipoDTE, observacionesdte.observacionesdte);
    respFEL = JSON.parse(respFEL);
    if (respFEL['resultado'] === true) {
        /*   const noNotacredito = respFEL['numero'];
          const uuidNotacredito = respFEL['uuid'];
  
          resp = await Cita.updateOne({ _id: cita, finalizada: true }, { 'factura.notacredito': noNotacredito, 'factura.uuidnotacredito': uuidNotacredito}, {
              upsert: true
          }); */
        res.json({ 'nModified': 1, 'uuid': respFEL['uuid'] });
    }
    else {
        res.json({ 'nModified': 0 });
    }
});
exports.emitirNotaDebito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    let tipoDTE = 'NDEB';
    const { cita } = req.params;
    const observaciones = req.body;
    let respFEL = yield crearDTE(cita, true, tipoDTE, observaciones.observacionesdte);
    respFEL = JSON.parse(respFEL);
    if (respFEL['resultado'] === true) {
        /*   const noNotacredito = respFEL['numero'];
          const uuidNotacredito = respFEL['uuid'];
  
          resp = await Cita.updateOne({ _id: cita, finalizada: true }, { 'factura.notacredito': noNotacredito, 'factura.uuidnotacredito': uuidNotacredito}, {
              upsert: true
          }); */
        res.json({ 'nModified': 1, 'uuid': respFEL['uuid'] });
    }
    else {
        res.json({ 'nModified': 0 });
    }
});
exports.anularFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idCita } = req.params;
    let resp = false;
    let tipoDTE = 'ANULACION';
    const observaciones = req.body;
    let respFEL = yield crearDTEAnulacion(idCita, true, tipoDTE, observaciones.observacionesdte);
    respFEL = JSON.parse(respFEL);
    if (respFEL['resultado'] === true) {
        resp = true;
        //await crearFEL(idCita, false);
        yield cita_model_1.Cita.find({ _id: idCita }, { consumibles: 1 }).then((resp) => {
            resp[0].consumibles.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                yield producto_model_1.Producto.updateOne({ _id: require('mongoose').Types.ObjectId(element.id) }, { $inc: { stockconsumible: Number(element.cantidad) } });
            }));
        });
        yield cita_model_1.Cita.find({ _id: idCita }, { insumos: 1 }).then((resp) => {
            resp[0].insumos.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                yield producto_model_1.Producto.updateOne({ _id: require('mongoose').Types.ObjectId(element.id) }, { $inc: { stockinsumo: Number(element.cantidad) } });
            }));
        });
        yield cita_model_1.Cita.find({ _id: idCita }, { productos: 1 }).then((resp) => {
            resp[0].productos.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                yield producto_model_1.Producto.updateOne({ _id: require('mongoose').Types.ObjectId(element.id) }, { $inc: { stockfarmacia: Number(element.cantidad) } });
            }));
        });
        yield cita_model_1.Cita.find({ _id: idCita }, { ortopodologia: 1 }).then((resp) => {
            resp[0].ortopodologia.forEach((element) => __awaiter(void 0, void 0, void 0, function* () {
                yield producto_model_1.Producto.updateOne({ _id: require('mongoose').Types.ObjectId(element.id) }, { $inc: { stockortopodologia: Number(element.cantidad) } });
            }));
        });
    }
    res.json({ ok: resp });
});
