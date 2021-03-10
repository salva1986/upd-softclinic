import { Response, Request } from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';

import { resolve } from 'dns';
import { isNullOrUndefined } from 'util';

export const login = (req: Request, res: Response) => {
    const body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombres,
                email: userDB.email,
                avatar: userDB.avatar,
                tipo: userDB.tipo
            }).then((tokengenerado) => {
                res.json({
                    ok: true,
                    token: tokengenerado
                });
            });

        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
    })
}
export const crearUsuario = (req: Request, res: Response) => {
    const user = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar,
        tipo: req.body.tipo
    };
    Usuario.create(user).then(userDB => {
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombres,
            email: userDB.email,
            avatar: userDB.avatar,
            tipo: userDB.tipo
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
}


export const obtenerUsuario = (req: any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
}



export const verTodos = async (req: any, res: Response) => {
    let usuarios = {};

    if (req.params.estado == "activos" || req.params.estado == 'undefined') {
        usuarios = await Usuario.find({ $where: function () { return (this.estado == true) } }, { 'password': 0 }).populate({ path: 'tipo', model: 'Rol', select: { 'nombre': 1 } });
    } else if (req.params.estado == "noactivos") {
        usuarios = await Usuario.find({ $where: function () { return (this.estado == false) } }, { 'password': 0 }).populate({ path: 'tipo', model: 'Rol', select: { 'nombre': 1 } });
    } else if (req.params.estado == 'all') {
        usuarios = await Usuario.find({}, { 'password': 0 }).populate({ path: 'tipo', model: 'Rol', select: { 'nombre': 1 } });
    }
    res.json(usuarios);
}



export const actualizarUsuario = async (req: any, res: Response) => {

    let rs = "";
    let resp: any;
    const { id } = req.params;
    if (id === 'null') {  // Insertar nuevo usuario
        const user = {
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            avatar: req.body.avatar,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.pass2, 10),
            tipo: req.body.tipo,
            telefono: req.body.telefono
        };
        const usuario = new Usuario(user);

        try {
            resp = await usuario.save();
        } catch (err) {
            if (err.code === 11000) {
                resp = "correoexiste";
            }
        }



        res.json({
            rs: resp
        });
    } else {// Actualizar si existe id

        if (isNullOrUndefined(req.body.pass2)) {
            req.body.pass2 = "*#$%&/(/)(&)/&)%$&$&%$&%$%$#$#$%%&(/(/&(/&(/&(";
        }
        let usuario = {};
        if (req.body.cambiocontrasena === 'si') {
            usuario = {
                // nombres: req.body.nombres,
                //apellidos: req.body.apellidos,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.pass2, 10),
                tipo: req.body.tipo,
                telefono: req.body.telefono
            };
        } else {
            usuario = {
                // nombres: req.body.nombres,
                //apellidos: req.body.apellidos,
                email: req.body.email,
                tipo: req.body.tipo,
                telefono: req.body.telefono
            };
        }


        if (id) {
            //  rs = await Usuario.updateOne({ _id: id }, usuario, { upsert: true }); 
            rs = await Usuario.updateOne({ _id: id }, usuario);
        }
        res.json({
            rs
        });
    }
};

export const eliminarUsuario = async (req: any, res: Response) => {

    const { id } = req.body;
    let { estado } = req.body;

    let rs = "";
    if (id) {
        estado = !estado;
        rs = await Usuario.updateOne({ _id: id }, { estado });
    }
    res.json({
        rs
    });
};

export const eliminarUsuarios = async (req: any, res: Response) => {
    let estado = (req.params.filtro === 'activos' || req.params.filtro === 'undefined') ? true : false;
    estado = !estado;

    await Usuario.updateMany({ _id: { $in: req.body } }, { $set: { estado } });
    res.json({
        'status': 'Usuarios dados de baja'
    });
};

export const destruir_Token = async (req: any, res: Response) => {
    console.log("destruir_Token ", req);
    res.json({
        'status': 'Usuarios dados de baja'
    });
};
