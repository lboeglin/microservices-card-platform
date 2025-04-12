'use strict'

import dotenv from 'dotenv'
import mongoose from 'mongoose';

//pour lire le .env
dotenv.config()

//port serveur http
const serverPort = process.env.PORT
//mongodb url
const mongoURL = process.env.MONGO_URL
//mongodb db
const mongoDB = process.env.MONGO_DB

//environnement PROD ou DEV ou TEST
const env = (new URL(import.meta.url)).searchParams.get('ENV') || process.env.ENV || 'PROD'
console.log(`env : ${env}`)

let mongoMemoryServer = null

//connexion à la BD
if (env == 'TEST') {
    //en test le travail est en mémoire
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri)
    console.log("Mongo on memory " + uri)
} else {
    await mongoose.connect(mongoURL + '/' + mongoDB)
    console.log("Mongo on " + mongoURL + '/' + mongoDB)
}

//import de l'application
const { default: app } = await import('./app.mjs')

//lancement du serveur http
const server = app.listen(serverPort, () =>
    console.log(`app listening on port ${serverPort}\nAPI is running on http://127.0.0.1:3000${process.env.API_PATH}`)
)

// Pour les interruptions utilisateur
for (let signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () => {
        console.info(`${signal} signal received.`)
        console.log("Closing http server.");
        server.close(async (err) => {
            console.log("Http server closed.")
            await mongoose.connection.close()
            console.log("MongoDB connection closed.")
            if (mongoMemoryServer) {
                mongoMemoryServer.stop()
                console.log("In-memory MongoDB server stopped.")
            }
            process.exit(err ? 1 : 0)
        });
    });


export default server

