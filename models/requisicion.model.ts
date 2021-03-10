import { Schema, model, Document } from 'mongoose';

const requisicionSchema = new Schema({
    producto: {
        type: Schema.Types.ObjectId, ref: 'Producto'
    },
    cantidad: {
        type: Number
    },
    nota: {
        type: String,
    },
    unidad: {
        type: String,
    },
    estadopedido : {type : String, default: 'En espera'},
    fechafinalizacion: {type : Date},
    estado: {
        type : Boolean, default: true
    },
    fechapedido: { type: Date, required: true, default: Date.now },
});



interface IRequisicion extends Document {
    producto: string;
    cantidad: number;
    nota: string;
    unidad: string;
    estadopedido: string;
    estado: Boolean;
    fechapedido: Date;
}

export const Requisicion = model<IRequisicion>('Requisicion', requisicionSchema);