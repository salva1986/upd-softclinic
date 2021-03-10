import { Schema, model, Document } from 'mongoose';

const dteSchema = new Schema({
    idcita:{
        type: Schema.Types.ObjectId, ref: 'citas',
        required: [ true, 'Id de cita es necesario' ]
    },
    tipo: String,
    xml: {
        type: String,
        required: [ true, 'xml necesario' ]
    },
    respuesta: {
        type: String,
        required: [ true, 'respuesta necesaria' ]
    },
    estado : {type : Boolean, required: true, default: true}, // 0 anulada, 1  autorizada
    fechacreacion: { type: Date, required: true },
});



interface IDTE extends Document {
    idcita: string;
    xml: string;
    estado: Boolean;
    fechacreacion: Date;
}

export const DTE = model<IDTE>('DTE', dteSchema);