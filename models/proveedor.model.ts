import { Schema, model, Document } from 'mongoose';

const proveedorSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [ true, 'El nombre es necesario' ]
    },
      
    direccion: {
        type: String,
    },
    telefono: {
        type: String,
    },
    observacion: {
        type: String,
    },
    estado : {type : Boolean, default: true},
    fechacreacion: { type: Date, required: true, default: Date.now },
});



interface IProveedor extends Document {
    nombre: string;
    direccion: string;
    telefono: String,
    observacion: String;
    estado: Boolean;
    fechacreacion: Date;
}

export const Proveedor = model<IProveedor>('Proveedor', proveedorSchema);