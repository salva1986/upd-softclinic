import { Schema, model, Document } from 'mongoose';

const presentacionSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [ true, 'El nombre es necesario' ]
    },
    descripcion: {
        type: String,
    },
   
    preciocosto: {
        type: Number,
    },
    precioventa: {
        type: String,
    },
    codigo: {
        type: String,
    },
    estado : {type : Boolean, default: true},
    fechacreacion: { type: Date, required: true, default: Date.now },
});

interface IPresentacion extends Document {
    nombre: string;
    descripcion: string;
    preciocosto: Number,
    precioventa: Number;
    codigo: string;
    estado: string;
    fechacreacion: Date;
}

export const Presentacion = model<IPresentacion>('Presentacion', presentacionSchema);