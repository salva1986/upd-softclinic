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
const producto_model_1 = require("../models/producto.model");
const factura_model_1 = require("../models/factura.model");
const requisicion_model_1 = require("../models/requisicion.model");
exports.obtenerProducto = (req, res) => {
    const producto = req.producto;
    res.json({
        ok: true,
        producto
    });
};
exports.actualizarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = '';
    let ok = '';
    let resp;
    const { id } = req.params;
    const prod = {
        codigo: req.body.codigo,
        proveedor: req.body.proveedor,
        nombre: req.body.nombre,
        nombremostrar: req.body.nombremostrar,
        descripcion: req.body.descripcion,
        tipo: req.body.tipo,
        presentacion: req.body.presentacion,
        linea: req.body.linea,
        casa: req.body.casa,
        precioventacaja: req.body.precioventacaja,
        escontrolado: req.body.escontrolado,
        stockminimo: req.body.stockminimo
    };
    if (id === 'null') { // Insertar nuevo producto
        const producto = new producto_model_1.Producto(prod);
        try {
            resp = yield producto.save();
            res.json({
                ok: true,
                rs: resp
            });
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "productoyaexiste";
            }
            res.json({
                ok: false,
                rs: resp,
                error: err
            });
        }
    }
    else { // Actualizar si existe id
        if (id) {
            try {
                rs = yield producto_model_1.Producto.updateOne({ _id: id }, prod);
                res.json({
                    ok: true,
                    rs: rs
                });
            }
            catch (error) {
                res.json({
                    ok: false,
                    rs: rs
                });
            }
            //  rs = await Producto.updateOne({ _id: id }, producto, { upsert: true });
        }
    }
});
exports.registrarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let rs = "";
    let resp;
    const { id } = req.params;
    const prod = {
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        nombremostrar: req.body.nombremostrar,
        descripcion: req.body.descripcion,
        tipo: req.body.tipo,
        presentacion: req.body.presentacion,
        linea: req.body.linea,
        casa: req.body.casa,
        precioventacaja: req.body.precioventacaja,
        escontrolado: req.body.escontrolado,
        stock: 0,
        stockminimo: req.body.stockminimo
    };
    if (id === 'null') { // Insertar nuevo producto
        const producto = new producto_model_1.Producto(prod);
        try {
            resp = yield producto.save();
            res.json({
                ok: true,
                rs: resp
            });
        }
        catch (err) {
            if (err.code === 11000) {
                resp = "producto ya existe";
            }
            res.json({
                ok: false,
                rs: err
            });
        }
    }
    else { // Actualizar si existe id
        if (id) {
            try {
                rs = yield producto_model_1.Producto.updateOne({ _id: id, estado: true }, prod);
                res.json({
                    ok: true,
                    rs: resp
                });
            }
            catch (error) {
                res.json({
                    ok: false,
                    rs: error
                });
            }
        }
    }
});
exports.eliminarProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let { estado } = req.body;
    let rs = "";
    if (id) {
        estado = !estado;
        rs = yield producto_model_1.Producto.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
});
exports.eliminarProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;
    yield producto_model_1.Producto.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Productos dados de baja'
    });
});
exports.verProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const producto = yield producto_model_1.Producto.findById(id);
    res.json(producto);
});
//Agregar al stock
exports.addStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { producto, bonificacion } = req.body.entrada;
    let factura = req.params.factura;
    bonificacion == 'no' ? req.body.entrada.totalbonificacion = 0 : req.body.entrada.totalbonificacion;
    const idproducto = producto;
    let entrada = {
        factura: factura,
        cantidad: req.body.entrada.cantidad,
        precio: req.body.entrada.precio,
        bonificacion: req.body.entrada.bonificacion,
        vencimientoproducto: req.body.entrada.vencimientoproducto,
        totalbonificacion: req.body.entrada.totalbonificacion,
        lote: req.body.entrada.lote,
        ubicacionfisica: req.body.entrada.ubicacionfisica
    };
    const verificarEstadoFactura = yield factura_model_1.Factura.count({ _id: factura, estado: true });
    verificarEstadoFactura === 0 ? factura = undefined : verificarEstadoFactura;
    if (factura === undefined) {
        const totalstock = yield producto_model_1.Producto.find({ _id: idproducto }, { stock: 1 });
        const resp = {
            n: 0,
            nModified: 0,
            totalstock: totalstock
        };
        res.json(resp);
    }
    else {
        const resp = yield producto_model_1.Producto.updateOne({ _id: idproducto, estado: true }, { $push: { entradas: entrada } });
        let { nModified } = resp;
        if (nModified == 1) {
            let incrementar = yield producto_model_1.Producto.updateOne({ _id: idproducto }, { $inc: { stock: entrada.cantidad + entrada.totalbonificacion } });
            let { nModified } = incrementar;
            if (nModified == 1) {
                const totalstock = yield producto_model_1.Producto.find({ _id: idproducto }, { stock: 1 });
                resp.totalstock = totalstock;
            }
            res.json(resp);
        }
        else {
            res.json(resp);
        }
    }
});
//Agregar al stock
exports.verStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const idproducto = id;
    const totalstock = yield producto_model_1.Producto.find({ _id: idproducto }, { stock: 1, codigo: 1, nombre: 1, descripcion: 1 });
    /* let total = await Producto.aggregate([
        { $match: { "_id": require('mongoose').Types.ObjectId(idproducto) } },
        { $unwind: '$entradas' },
        {
            $group: {
                _id: null,
                "totalvolumen": { $sum: "$entradas.volumen.cantidad" },
                "totalunidades": { $sum: "$entradas.volumen.totalunidades" }
            }
        }
    ]); */
    res.json({
        'totalstock': totalstock
    });
});
//Ver entradas de Producto y  stock
/* export const verInfoProducto = async (req: any, res: Response) => {
    const { id } = req.params;
    const idproducto = id;
    const infoproducto = await Producto.find({_id: idproducto, estado: true }, {stock:1, nombre: 1, descripcion: 1, entradas: 1});
    res.json({
        'res': infoproducto
    });
} */
exports.verInfoProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let entradas = {
        total_count: {},
        items: {}
    };
    let { id } = req.params;
    entradas.items = yield producto_model_1.Producto.find({ _id: id, estado: true }, { entradas: { $slice: [(req.params.page - 1) * 10, 10] }, codigo: 1, nombre: 1, descripcion: 1, stock: 1 }).populate('entradas.factura', 'referenciafactura');
    entradas.total_count = yield producto_model_1.Producto.aggregate([
        { $match: { _id: require('mongoose').Types.ObjectId(id) } },
        { $unwind: "$entradas" },
        { $group: { _id: "null", number: { $sum: 1 } } }
    ]);
    res.json(entradas);
});
// Sirve especificamente para cargar productos en un select --- solo id, nombre y stock
exports.verSelectProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let productos = {};
    productos = yield producto_model_1.Producto.find({ estado: true }, { nombre: 1, codigo: 1, stock: 1 });
    res.json(productos);
});
exports.verDetalleProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fecha = new Date();
    let dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    let { id } = req.params;
    let resp = {
        productos: {},
        entradas: {},
        salidas: {},
        requisiciones: {}
    };
    resp.productos = yield producto_model_1.Producto.find({ _id: id, estado: true });
    resp.entradas = yield producto_model_1.Producto.aggregate([
        { $match: { _id: require('mongoose').Types.ObjectId(id), 'entradas.estado': true } },
        {
            '$unwind': '$entradas'
        },
        { $match: { _id: require('mongoose').Types.ObjectId(id), 'entradas.estado': true } },
        {
            $project: {
                cantidad: '$entradas.cantidad',
                day: { $cond: ['$entradas.fecharegistro', { $dayOfMonth: '$entradas.fecharegistro' }, -1] },
                month: { $cond: ['$entradas.fecharegistro', { $month: '$entradas.fecharegistro' }, -1] },
                year: { $cond: ['$entradas.fecharegistro', { $year: '$entradas.fecharegistro' }, -1] }
            }
        },
        { $match: { 'month': mes, 'year': anio } },
        {
            $group: {
                _id: null,
                total: {
                    $sum: '$cantidad'
                }
            }
        }
    ]);
    resp.salidas = yield requisicion_model_1.Requisicion.aggregate([
        { $match: { producto: require('mongoose').Types.ObjectId(id), estadopedido: 'Finalizado' } },
        { "$redact": { "$cond": [{ "$and": [{ "$eq": [{ "$year": "$fechafinalizacion" }, anio] }, { "$eq": [{ "$month": "$fechafinalizacion" }, mes] }] }, "$$KEEP", "$$PRUNE"] } },
        { $group: { _id: null, 'suma': { $sum: '$cantidad' } } }
    ]);
    resp.requisiciones = yield requisicion_model_1.Requisicion.find({ producto: require('mongoose').Types.ObjectId(id), estadopedido: "En Espera" }).count();
    res.json(resp);
});
exports.verProductosActivos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let productos = {};
    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        productos = yield producto_model_1.Producto.find({ $where: function () { return (this.estado == true); } }, { entradas: 0 }).populate({ path: 'presentacion', model: 'Presentacion' }).populate({ path: 'casa', model: 'Casa' }).populate({ path: 'linea', model: 'Linea' }).sort({ codigo: 1 });
    }
    else if (req.params.estado == "noactivos") {
        productos = yield producto_model_1.Producto.find({ $where: function () { return (this.estado == false); } }).populate({ path: 'presentacion', model: 'Presentacion' }).populate({ path: 'casa', model: 'Casa' }).populate({ path: 'linea', model: 'Linea' }).sort({ codigo: 1 });
    }
    else if (req.params.estado == 'all') {
        productos = yield producto_model_1.Producto.find({}).populate({ path: 'presentacion', model: 'Presentacion' }).populate({ path: 'linea', model: 'Linea' }).populate({ path: 'casa', model: 'Casa' }).sort({ codigo: 1 });
    }
    else if (req.params.estado == "verProductos") {
        productos = yield producto_model_1.Producto.find({ estado: true }, { codigo: 1, nombre: 1, stock: 1 }).sort({ codigo: 1 });
    }
    res.json(productos);
});
exports.verTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let productos = {
        total_count: 0,
        items: {}
    };
    //Total de pacientes activos - no activos
    let { texto } = req.params;
    if (req.params.estado === 'noactivos') {
        if (texto === 'undefined') {
            productos.items = yield producto_model_1.Producto.find({ estado: false }).skip((req.params.page - 1) * 30).limit(30).populate({ path: 'presentacion', model: 'Presentacion' }).populate({ path: 'casa', model: 'Casa' }).populate({ path: 'linea', model: 'Linea' }).sort({ nombre: 1 });
            productos.total_count = yield producto_model_1.Producto.countDocuments({ estado: false });
        }
        else {
            productos.items = yield producto_model_1.Producto.find({ $and: [{ $or: [{ nombre: new RegExp(texto, 'i') }] }, { estado: false }] }).skip(0).limit(30).sort({ nombre: 1 });
            //productos.total_count = await Producto.find({$and: [{ $or: [{ nombre: new RegExp(texto, 'i') }] }, {estado: false}]}).skip(0).limit(30).countDocuments({});
            productos.total_count = Object.keys(productos.items).length;
        }
    }
    else if (req.params.estado === "activos" || req.params.estado === 'undefined') {
        if (texto === 'undefined') {
            productos.items = yield producto_model_1.Producto.find({ estado: true }).skip((req.params.page - 1) * 30).limit(30).populate({ path: 'presentacion', model: 'Presentacion' }).populate({ path: 'casa', model: 'Casa' }).populate({ path: 'linea', model: 'Linea' }).sort({ codigo: 1 });
            productos.total_count = yield producto_model_1.Producto.countDocuments({ estado: true });
        }
        else {
            productos.items = yield producto_model_1.Producto.find({ $and: [{ $or: [{ nombre: new RegExp(texto, 'i') }] }, { estado: true }] }).skip(0).limit(30).populate({ path: 'presentacion', model: 'Presentacion' }).populate({ path: 'casa', model: 'Casa' }).populate({ path: 'linea', model: 'Linea' }).sort({ codigo: 1 });
            productos.total_count = Object.keys(productos.items).length;
        }
    }
    res.json(productos);
});
