import { Schema, model, Document } from 'mongoose';

const pedidoSchema = new Schema({
    nombres: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    apellidos: {
        type: String,
        required: [ true, 'El apellido es necesario' ]
    },
    fechanacimiento:{
        type: Date,
        default: null
    },
    email: {
        type: String,
        unique: true,
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



interface IPedido extends Document {
    nombres: string;
    apellidos: string;
    fechanacimiento: Date,
    email: string;
    telefono: string;
    direccion: string;
    estado: Boolean;
    avatar: string;
    fechacreacion: Date;
}

export const Pedido = model<IPedido>('Pedido', pedidoSchema);
