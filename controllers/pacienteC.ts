import { Response, Request } from 'express';
import { Paciente } from '../models/paciente.model';

export const obtenerPaciente = (req: any, res: Response) => {
    const paciente = req.paciente;
    res.json({
        ok: true,
        paciente
    });
}

export interface ParamsFiltro {
    estado: string;
    sort: string;
    order: string;
    page: number;
}

export const verPacienteById = async (req: any, res: Response) => {
    const id = req.params.id;
    const paciente = await Paciente.findById(id);
    res.json(paciente);
}

export const selectAll = async (req: any, res: Response) => {
    let pacientes = {};
    pacientes = await Paciente.find({ $where: function () { return (this.estado == true) } }).sort({ nombres: 1 });
    res.json(pacientes);
}

export const verTodos = async (req: any, res: Response) => {
    let pacientes = {
        total_count: 0,
        items: {}
    };
    //Total de pacientes activos - no activos
    let { texto } = req.params;

    if (req.params.estado === 'noactivos') {
        if (texto === 'undefined') {
            pacientes.items = await Paciente.find({estado: false}).skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            pacientes.total_count = await Paciente.countDocuments({estado: false});
        } else {
          pacientes.items = await Paciente.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i'), hc: new RegExp(texto, 'i') }] }, {estado: false}]}).skip(0).limit(30).sort({ nombres: 1 });
          //pacientes.total_count = await Paciente.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, {estado: false}]}).skip(0).limit(30).countDocuments({});
          pacientes.total_count  = Object.keys(pacientes.items).length;
        }
    } else  if (req.params.estado === "activos" || req.params.estado === 'undefined') {
         if (texto === 'undefined') {
            pacientes.items = await Paciente.find({estado: true}).skip((req.params.page - 1) * 30).limit(30).sort({ nombres: 1 });
            pacientes.total_count = await Paciente.countDocuments({estado: true});
        } else {
            pacientes.items = await Paciente.find({$and: [{ $or: [{ nombres: new RegExp(texto, 'i') }] }, {estado: true}]}).skip(0).limit(30).sort({ nombres: 1 });
          
            pacientes.total_count  = Object.keys(pacientes.items).length;
        } 
    }
    res.json(pacientes);
}

export const verTodosExcel = async (req: any, res: Response) => {
    let pacientes = {};
    pacientes = await Paciente.find({}).sort({codigo: 1});
    res.json(pacientes);
}


export const actualizarPaciente = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
    const { id } = req.params;
    const body = req.body;
    if (id === 'null') {  // Insertar nuevo paciente
        const paciente = new Paciente(body);
        await paciente.save();
        try {
            resp = await paciente.save();
        } catch (err) {
            if (err.code === 11000) {
                resp = "correoexiste";
            }
        }
        res.json({
            rs: resp
        });
    } else {// Actualizar si existe id
        if (id) {
            //  rs = await Paciente.updateOne({ _id: id }, paciente, { upsert: true }); 
            rs = await Paciente.updateOne({ _id: id }, body);
        }
        res.json({
            rs
        });
    }
};

export const eliminarPaciente = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Paciente.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarPacientes = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Paciente.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Pacientes dados de baja'
    });
};

export const consultarNit = async (req: any, res: Response) => {
    let resp:  any;
    const { nit } = req.params;

  
    if (nit === '0' || nit.toLowerCase() === 'c/f' || nit.toLowerCase() === 'cf' || nit === '') {
           resp = {};
    }else{
        resp = await Paciente.find({ nit }).limit(1);
    }

    res.json({
        resp
    });
};


export const actualizardatos = async (req: any, res: Response) => {
    const { idpaciente } = req.params;

    const datos = {
        nit: req.body.nit,
        nombres: req.body.nombre,
        direccion: req.body.direccion,
        email: req.body.correo
    }
    let rs = "";
    if (idpaciente) {
        rs = await Paciente.updateOne({ _id: require('mongoose').Types.ObjectId(idpaciente) }, datos );
    }
    res.json({
        rs
    });
};





