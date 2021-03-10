import { Schema, model, Document } from 'mongoose';

const stockSchema = new Schema({

    unidad: String,
    stock: Number,
    entradas: [{
        producto: {
            type: Schema.Types.ObjectId, ref: 'Producto'
        },
        cantidad: { type: Number, required: true, default: 0 },
        fechaentrada: { type: Date, default: Date.now },
    }],
    salidas: [{
        producto: {
            type: Schema.Types.ObjectId, ref: 'Producto'
        },
        cantidad: { type: Number, required: true, default: 0 },
        fechaentrada: { type: Date, default: Date.now },
    }],
    estado: { type: Boolean, default: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});

interface IStock extends Document {
    unidad: string;
    stock: string;
    entradas: any;
    salidas: any;
    estado: Boolean;
    fechacreacion: Date;
}

export const Stock = model<IStock>('Stock', stockSchema);