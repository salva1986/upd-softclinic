//import jwt from 'jsonwebtoken';
var redis = require('redis');
var JWTR = require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);

export default class Token {

    private static seed: string = '3ste-es-el-s##d-de-Mi-4pp-$ecret0';
    private static caducidad: string = '11h';

    constructor() { }

    static async getJwtToken(payload: any) {
        //let jwtrs = jwtr.sign({ usuario: payload }, this.seed, { expiresIn: this.caducidad });
        let jwtrs = await jwtr.sign({ usuario: payload }, this.seed, { expiresIn: this.caducidad }).then(function(token: string){
            return token;
        }).catch((error: any) => {
            return error;
        });
  
        return jwtrs
    }

    static async comprobarToken(userToken: string) {
     let jwtrs;
        try{
             jwtrs = await jwtr.verify(userToken, this.seed).then(function(user: string){
                return user;
            })
        }
        catch(err)  {
            jwtrs = false; 
          
        };
  
        return jwtrs
    }

    static async destruirToken(userToken: string) {
        let jwtrs;
        try{
            jwtrs = await jwtr.destroy(userToken).then(function(res: any){
                return res;
            });
        }
        catch(err)  {
            jwtrs = false; 
        };
  
        return jwtrs
    }


}



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
