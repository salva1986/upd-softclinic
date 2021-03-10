"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//import jwt from 'jsonwebtoken';
var redis = require('redis');
var JWTR = require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);
class Token {
    constructor() {
    }
    static getJwtToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            //let jwtrs = jwtr.sign({ usuario: payload }, this.seed, { expiresIn: this.caducidad });
            let jwtrs = yield jwtr.sign({ usuario: payload }, this.seed, { expiresIn: this.caducidad }).then(function (token) {
                return token;
            }).catch((error) => {
                return error;
            });
            return jwtrs;
        });
    }
    static comprobarToken(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let jwtrs;
            try {
                jwtrs = yield jwtr.verify(userToken, this.seed).then(function (user) {
                    return user;
                });
            }
            catch (err) {
                jwtrs = false;
            }
            ;
            return jwtrs;
        });
    }
    static destruirToken(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let jwtrs;
            try {
                jwtrs = yield jwtr.destroy(userToken).then(function (res) {
                    return res;
                });
            }
            catch (err) {
                jwtrs = false;
            }
            ;
            return jwtrs;
        });
    }
}
exports.default = Token;
Token.seed = '3ste-es-el-s##d-de-Mi-4pp-$ecret0';
Token.caducidad = '11h';
/* export default class Token {

    private static seed: string = 'este-es-el-seed-de-mi-app-secreto';
    private static caducidad: string = '30d';

    constructor() { }

    static getJwtToken( payload: any ): string {
        return jwtr.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });

    }

    static comprobarToken( userToken: string ) {

        return new Promise( (resolve, reject ) => {

            jwtr.verify( userToken, this.seed, ( err, decoded ) => {

                if ( err ) {
                    reject();
                } else {
                    resolve( decoded );
                }


            })

        });


    }


}

 */
