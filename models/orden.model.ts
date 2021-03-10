import { Schema, model, Document } from 'mongoose';

const ordenSchema = new Schema({
    hc: {
        type: Number,
        required: [ true, 'La historia clinica es necesaria' ]
    },
    nit: {
        type: String,
    },
    dpi: {
        type: Number,
        unique: true,
    },
    nombres: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    fechanacimiento:{
        type: Date,
        default: null
    },
    email: {
        type: String,
       // unique: true,
    },
    telefono: {
        type: String,
    },
    direccion: {
        type: String,
    },
    estado : {type : Boolean, default: true},
    nota : {type : String},
    avatar: {
        type: String,
        default: 'assets/images/avatars/profile.jpg'
    },
    fechacreacion: { type: Date, required: true, default: Date.now },
});



interface IOrden extends Document {
    hc: number;
    nit: String;
    dpi: number;
    nombres: string;
    fechanacimiento: Date,
    email: string;
    telefono: string;
    direccion: string;
    estado: Boolean;
    avatar: string;
    fechacreacion: Date;
}

export const Orden = model<IOrden>('Orden', ordenSchema);
