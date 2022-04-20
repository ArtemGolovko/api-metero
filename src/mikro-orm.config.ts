import type { Options } from "@mikro-orm/core";
import { config } from 'dotenv';
import { User } from "./Entity/User";

config({
    path: __dirname + "/.env"
});


export default {
    entities: [User],
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    type: 'mysql',
    migrations: {
        tableName: 'migrations',
        pathTs: 'src/Migrations',
        path: 'dist/Migrations'
    }
} as Options;