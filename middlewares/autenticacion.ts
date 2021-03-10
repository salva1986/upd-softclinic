import { Response, NextFunction } from 'express';
import Token from '../classes/token';

export const verificaToken = ( req: any, res: Response, next: NextFunction  ) => {
    const userToken = req.get('x-token') || '';
    Token.comprobarToken( userToken )
        .then(  (decoded: any) => {
            req.usuario = decoded.usuario;

            if(decoded===false){
                res.json({
                    ok: false,
                    mensaje: 'No tienes permiso para ver esta información'
                    //mensaje: 'Token no es correcto'
                });  
            }else{
                next();
            }
        });
        /*.catch( err => {
            res.json({
                ok: false,
                mensaje: 'Token no es correcto'
            });
        });*/
}

export const destruir_Token = ( req: any, res: Response, next: NextFunction  ) => {
    const userToken = req.params.xtoken || '';
    let varrr = Token.destruirToken( userToken )
        .then(  (resp: any) => {
            res.json({
                ok: true,
                mensaje: 'Sessión finalizada con éxito'
            });
        })
        .catch( err => {
            res.json({
                ok: false,
                mensaje: 'Error al destruir token'
            });
        });

}