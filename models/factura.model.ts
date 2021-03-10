import { Schema, model, Document } from 'mongoose';

const facturaSchema = new Schema({
    fechafactura:{
        type: Date,
        required: [ true, 'Fecha es necesaria' ]
    },
    referenciafactura: {
        type: String,
        required: [ true, 'Referencia necesaria' ]
    },
    montofactura: {
        type: Number
    },
    impuesto: {
        type: Number,
    },
    proveedor: {
        type: Schema.Types.ObjectId, ref: 'Proveedor',
    },
    contado: {
        type: String,
    },
    vencimientofactura: {
        type: String,
    },
    pagada: {type : Boolean, default: true},
    fechavencimientofactura: {
        type: Date,
    },
    nota : {type : String},
    estado : {type : Boolean, default: true},
    fechacreacion: { type: Date, required: true, default: Date.now },
});



interface IFactura extends Document {
    fechafactura: Date,
    referenciafactura: string;
    montofactura: number;
    impuesto: number;
    proveedor: string;
    contado: string;
    vencimientofactura: string;
    pagada: Boolean;
    fechavencimientofactura: string;
    nota: string;
    estado: Boolean;
    fechacreacion: Date;
}

export const Factura = model<IFactura>('Factura', facturaSchema);