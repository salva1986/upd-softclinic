import { Schema, model, Document } from 'mongoose';

const entradaSchema = new Schema({
    proveedor: {
        type: Schema.Types.ObjectId, ref: 'proveedores',
    },
    producto: {
        type: Schema.Types.ObjectId, ref: 'productos',
    },
    referencia: {
        type: String,
    },
    factura:{
        type: String,
    },
    preciounidad: {
        type: Number,
    },
    cantidad: {
        type: Number,
    },
    observacion: {
        type: String,
    },
    estado : {type : Boolean, default: true},
    fechacreacion: { type: Date, required: true, default: Date.now },
});



interface IEntrada extends Document {
    proveedor: string;
    producto: string;
    referencia: string;
    factura: string;
    preciounidad: Number,
    cantidad: Number;
    observacion: string;
    estado: string;
    fechacreacion: Date;
}

export const Entrada = model<IEntrada>('Entrada', entradaSchema);