import { Schema, model, Document } from 'mongoose';

const salidaSchema = new Schema({
    unidad: {
        type: Schema.Types.ObjectId, ref: 'Bodega',
        required: [true, 'La unidad solicitante es necesaria']
    },
    producto: {
        type: Schema.Types.ObjectId, ref: 'Producto',
        required: [true, 'El producto es necesario']
    },
    cantidad: {
        type: Number,
    },
    observaciones: {
        type: String,
    },
    estado : {type : Boolean, default: true},
    fechacreacion: { type: Date, required: true, default: Date.now },
});

interface ISalida extends Document {
    unidad: String
    producto: String;
    cantidad: Number;
    observaciones: String;
    estado: Boolean;
    fechacreacion: Date;
}

export const Salida = model<ISalida>('Salida', salidaSchema);
