import { Schema, model, Document } from 'mongoose';

const servicioSchema = new Schema({
    // codigo: {
    //     type: String,
    //     unique: true,
    //     required: [ true, 'El código es necesario' ]
    // },
    nombre: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    descripcion: {
        type: String,
    },
    precio: {
        type: Number,
        required: [ true, 'El precio es necesario' ]
    },
    estado : {type : Boolean, default: true},
    fechacreacion: { type: Date, required: true, default: Date.now },
});

interface IServicio extends Document {
    // codigo: string;
    nombre: string;
    descripcion: String;
    precio: Number;
    estado: Boolean;
    fechacreacion: Date;
}

export const Servicio = model<IServicio>('Servicio', servicioSchema);