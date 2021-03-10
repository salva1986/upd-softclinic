import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    nombres: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    apellidos: {
        type: String,
        required: [ true, 'El apellido es necesario' ]
    },
    avatar: {
        type: String,
        default: 'assets/images/avatars/profile.jpg'
    },
    email: {
        type: String,
        unique: true,
    },
    telefono: {
        type: String,
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es necesaria']
    },
    tipo: {
        type: Schema.Types.ObjectId, ref: 'roles'
    },
    fechacreacion: { type: Date, required: true, default: Date() },
    estado : {type : Boolean, default: true}
});

usuarioSchema.method('compararPassword', function( password: string = ''): boolean {
    if (  bcrypt.compareSync( password, this.password ) ) {
        return true;
    } else {
        return false;
    }
});


/* usuarioSchema.methods.save = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}; */

interface IUsuario extends Document {
    nombres: string;
    apellidos: string;
    avatar: string;
    email: string;
    telefono: string;
    password: string;
    compararPassword(password: string): boolean;
    tipo: number;
    fechacreacion: Date;
    estado: Boolean;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);