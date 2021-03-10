import { Schema, model, Document } from 'mongoose';

const citaSchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId, ref: 'pacientes',
        required: [true, 'El paciente es necesario']
    },
    servicios: [{
        id: {
            type: Schema.Types.ObjectId, ref: 'servicios',
            required: [true, 'El servicio es necesario']
        },
        cantidad: {
            type: Number
        },
        detalle: {
            type: String,
        },
        precio: {
            type: Number,
        },
        descuento: {
            type: Number
        },
        fecha: {
            type: Date,
        }
    }],
    consumibles: [{
        id: {
            type: Schema.Types.ObjectId, ref: 'consumibles',
            required: [true, 'El consumible es necesario']
        },
        cantidad: {
            type: Number
        },
        precio: {
            type: Number,
        },
        fecha: {
            type: Date,
        }
    }],
    insumos: [{
        id: {
            type: Schema.Types.ObjectId, ref: 'insumos',
            required: [true, 'El insumo es necesario']
        },
        cantidad: {
            type: Number
        },
        precio: {
            type: Number,
        },
        fecha: {
            type: Date,
        }
    }],
    productos: [{
        id: {
            type: Schema.Types.ObjectId, ref: 'productos',
            required: [true, 'El producto es necesario']
        },
        cantidad: {
            type: Number
        },
        precio: {
            type: Number,
        },
        fecha: {
            type: Date,
        }
    }],
    ortopodologia: [{
        id: {
            type: Schema.Types.ObjectId, ref: 'ortopodologia',
            required: [true, 'El producto es necesario']
        },
        precio: {
            type: Number,
        },
        cantidad: {
            type: Number
        },
        fecha: {
            type: Date,
        }
    }],
    factura: {
        nombre: String,
        nit: String,
        direccion: String,
        metodopago: {
            metodo: String,
            tarjeta: Number,
            efectivo: Number,
            cheque: Number,
            transferencia: Number,
        },
        total: Number,
        nofactura: '',
        uuid: '',
        facturaanulada: { type: Boolean, default: false },
        cantidadanulacion: { type: Number, default: 0 },
        uuidfacturaanulada: '',
        motivoanulacionfactura: '',
        descuento: {
            type: Number,
            default: 0
        },
        fecha: {
            type: Date
        },
        correo: String,
        observaciones: String,
    },
    notacredito: {
        nonotacredito: '',
        uuid: '',
        notacreditoemitida: { type: Boolean, default: false },
        observacionesnotacredito: '',
        fechacertificacion: { type: Date }
    },
    notadebito: {
        nonotadebito: '',
        uuid: '',
        notadebitoemitida: { type: Boolean, default: false },
        observacionesnotadebito: '',
        fechacertificacion: { type: Date }
    },
    fecha: {
        type: Date,
        default: null
    },

    hora: {
        type: String,
    },
    unidad: {
        type: String,
        // unique: true,
    },
    estado: { type: Boolean, default: true },
    nota: { type: String },
    avatar: {
        type: String,
        default: 'assets/images/avatars/profile.jpg'
    },
    fechacreacion: { type: Date, required: true, default: Date.now },
    finalizada: { type: Boolean, default: false },
});

interface ICita extends Document {
    paciente: string;
    servicios: any;
    insumos: any;
    consumibles: any;
    productos: any;
    ortopodologia: any;
    fecha: Date;
    hora: string;
    unidad: string;
    estado: Boolean;
    avatar: string;
    fechacreacion: Date;
    factura: any;
    finalizada: Boolean;
}

export const Cita = model<ICita>('Cita', citaSchema);
