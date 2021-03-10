import { Schema, model, Document } from 'mongoose';

const anulacionesdteSchema = new Schema({
    idcita: {
        type: Schema.Types.ObjectId, ref: 'citas',
        required: [ true, 'Id de cita es necesario' ]
    },
    identificador: String,
    numero:  String,
    tipo: String,
    uuid:  String,
    xml: {
        type: String,
        required: [ true, 'xml necesario' ]
    },
    fechaanulacion:  { type: Date, required: true },
    fechacreacion: { type: Date, required: true, default: Date.now },
});



interface Anulacionesdte extends Document {
    idcita: string;
    identificador: string
    numero:  string;
    tipo: string;
    uuid:  string;
    xml: string;
    fechaanulacion: Date;
    fechacreacion: Date;
}

export const Anulacionesdte = model<Anulacionesdte>('Anulacionesdte', anulacionesdteSchema);