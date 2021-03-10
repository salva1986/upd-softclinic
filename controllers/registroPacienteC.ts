import { Response, Request } from 'express';
import { RegistroPaciente } from '../models/registropaciente.model';
import Token from '../classes/token';


export const verTodos = async (req: any, res: Response) => {
    let registropacientes = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        registropacientes = await RegistroPaciente.find({ $where: function () { return (this.estado == true) } });
    } else if (req.params.estado == "noactivos") {
        registropacientes = await RegistroPaciente.find({ $where: function () { return (this.estado == false) } });
    } else if (req.params.estado == 'all') {
        registropacientes = await RegistroPaciente.find({});
    }

    res.json(registropacientes);
}



export const actualizarRegistroPaciente = async (req: any, res: Response) => {
    let rs = "";
    let resp: any;
    const { id } = req.params;
     const reg = {
        paciente: req.body.paciente,
        servicio: req.body.servicio,
        detalle: req.body.detalle,
    };

    if (id === 'null') {  // Insertar nuevo paciente

        const registro = new RegistroPaciente(reg);

        await registro.save();
        try {
            resp = await registro.save();
        } catch (err) {
             if(err.code===11000){
                resp = "duplicaciondedato";
            } 
        } 

        res.json({
            rs:resp
        });
    } else {// Actualizar si existe id


        if (id) {
            //  rs = await RegistroPaciente.updateOne({ _id: id }, paciente, { upsert: true }); 
            rs = await RegistroPaciente.updateOne({ _id: id }, reg);
        }
        res.json({
            rs
        });
    } 
};

export const eliminarRegistroPaciente = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await RegistroPaciente.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarRegistroPacientes = async (req: any, res: Response) => {

    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await RegistroPaciente.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Registros dados de baja'
    });
};