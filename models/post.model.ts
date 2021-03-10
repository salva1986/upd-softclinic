import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema({
    created: {
        type: Date
    },
    nombre: {
        type: String
    },
    imgs: [{
        type: String
    }],
    coords: {
        type: String   // -13.313123, 12.3123123
    },
    preguntas: [{
        tipo: {
            type: String
        },
        ayuda: {
            type: String
        },
        nombre: {
            type: String
        },
        requerido: {
            type: Boolean
        },
        respuesta: [{
            type: String
        }],
        opciones: [{
            id: {
                type: Number
            },
            nombre: {
                type: String
            }
        }],
        multiple: {
            type: Boolean
        }
    }],
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [ true, 'Debe de existir una referencia a un usuario' ]
    }
});

postSchema.pre<IPost>('save', function( next ) {
    this.created = new Date();
    next();
});

interface IPost extends Document {
    created: Date;
    mensaje: string;
    img: string[];
    coords: string;
    preguntas: [];
    usuario: string;
}

export const Post = model<IPost>('Post', postSchema);