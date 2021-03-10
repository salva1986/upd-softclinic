import { Schema, model, Document } from 'mongoose';

const bodegaSchema = new Schema({
    nombre: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    descripcion: {
        type: String,
    },
    contacto: {
        type: String,
    },
    telefono: {
        type: String,
    },
    estado : {type : Boolean, default: true},
    avatar: {
        type: String,
        default: 'assets/images/avatars/profile.jpg'
    },
    fechacreacion: { type: Date, required: true, default: Date.now },
});



interface IBodega extends Document {
    nombre: string;
    descripcion: string;
    contacto: string;
    telefono: string;
    estado: Boolean;
    avatar: string;
    fechacreacion: Date;
}

export const Bodega = model<IBodega>('Bodega', bodegaSchema);
