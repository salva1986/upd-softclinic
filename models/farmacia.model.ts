import { Schema, model, Document } from 'mongoose';

const farmaciaSchema = new Schema({
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
    estado: {
        type : Boolean, default: true
    },
    fechapedido: { type: Date, required: true, default: Date.now },
});



interface IFarmacia extends Document {
    producto: string;
    cantidad: number;
    nota: string;
    unidad: string;
    estadopedido: string;
    estado: Boolean;
    fechapedido: Date;
}

export const Farmacia = model<IFarmacia>('Farmacia', farmaciaSchema);