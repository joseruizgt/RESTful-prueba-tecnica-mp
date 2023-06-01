const express = require('express');
const cors = require('cors')
const db = require('../database/connection');
const sync = require('./Synchronization');
const routes = require('../routes');
const fileUpload = require('express-fileupload');

const whiteList = ['http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        const exist = whiteList.some(domain => domain === origin);
        if (exist) {
            callback(null, true);
        } else {
            callback(new Error('Access denied'));
        }
    }
}

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Conexion a bd
        this.dbConnection();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    middlewares() { // son funciones que se ejecutan siempre que se levante el servidor

        //CORS
        this.app.use(cors());

        //Lectura y paseo del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'))

        //subida de archivos al servidor
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }));

    }

    async dbConnection() {
        try {
            await db.authenticate();
            console.log('DB online');
        } catch (error) {
            throw new Error(error);
        }
    }

    routes() {

        this.app.use('/api', routes());
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto http://localhost:', this.port);
            sync();
        })
    }

}

module.exports = Server;