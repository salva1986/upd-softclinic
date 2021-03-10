import { Schema, model, Document } from 'mongoose';

const registroPacienteSchema = new Schema({
    paciente: {
        type: Schema.Types.ObjectId, ref: 'pacientes',
    },
    servicio: {
        type: Schema.Types.ObjectId, ref: 'servicios',
    },
    detalle: {
        type: String,
    },
    estado : {type : Boolean, default: true},
    fechaingreso: { type: Date, required: true, default: Date.now },
});



interface IRegistroPaciente extends Document {
    paciente: string;
    servicio: string;
    detalle: string;
    estado: string;
    fechaingreso: Date;
}

export const RegistroPaciente = model<IRegistroPaciente>('RegistroPaciente', registroPacienteSchema);