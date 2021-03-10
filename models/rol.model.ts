import { Schema, model, Document } from 'mongoose';

const rolSchema = new Schema({
    nombre: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    
    descripcion: {
        type: String,
    },
    estado : {type : Boolean, default: true},
    fechacreacion: { type: Date, required: true, default: Date.now },
});



interface IRol extends Document {
    nombre: string;
    descripcion: string;
    estado: Boolean;
    fechacreacion: Date;
}

export const Rol = model<IRol>('Rol', rolSchema);