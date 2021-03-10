import { Schema, model, Document } from 'mongoose';

const productoSchema = new Schema({
    codigo: {
        type: Number
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es necesario']
    },
    nombremostrar: {
        type: String
    },
    descripcion: {
        type: String, default: ''
    },
    tipo: {
        type: Number,
    },
    presentacion: {
        type: Schema.Types.ObjectId, ref: 'presentacions',
        required: [true, 'Tipo de presentación necesario']

    },
    linea: {
        type: Schema.Types.ObjectId, ref: 'lineas',
        required: [true, 'Tipo de linea de producto necesario']
    },
    casa: {
        type: Schema.Types.ObjectId, ref: 'casas',
        required: [true, 'Tipo de casa farmaceutica necesario']
    },
    precioventacaja: {
        type: Number
    },
    escontrolado:String,
    stock: Number,
    stockfarmacia: Number,
    stockinsumo: Number,
    stockortopodologia: Number,
    stockconsumible: Number,
    stockminimo: {
        type: Number,
        required: [true, 'El stock minimo es necesario']
    },
    entradas: [{
        factura: {
            type: Schema.Types.ObjectId, ref: 'Factura',
            required: [true, 'La factura es necesaria']
        }, 
        cantidad: Number,
        precio: Number,
        bonificacion: String,
        vencimientoproducto: Date,
        totalbonificacion: Number,
        lote: String,
        ubicacionfisica: String,
        fecharegistro:{ type: Date, default: Date.now },
        estado: { type: Boolean, default: true }
    }],
    images: {
        default: Boolean,
        id: String,
        url: String,
        type: String
    },
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});



interface IProducto extends Document {
    codigo: Number;
    nombre: string;
    nombremostrar: string;
    descripcion: string;
    tipo: Number;
    presentacion: string;
    linea: string,
    casa: string;
    precioventacaja: Number,
    escontrolado: string;
    stock: Number;
    stockfarmacia: Number,
    stockinsumo: Number,
    stockortopodologia: Number,
    stockconsumible: Number,
    stockminimo: Number;
    entradas: [{
        fecharegistro: Date,
        estado: boolean
    }],
    estado: string;
    fechacreacion: Date;
}

export const Producto = model<IProducto>('Producto', productoSchema);