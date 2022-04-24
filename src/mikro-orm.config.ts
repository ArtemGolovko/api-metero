import type { Options } from "@mikro-orm/core";
import { config } from 'dotenv';
import Comment from "./Entity/Comment";
import Hashtag from "./Entity/Hashtag";
import Post from "./Entity/Post";
import Reply from "./Entity/Reply";
import User from "./Entity/User";
import { databaseLogger } from "./logger";

config({
    path: __dirname + "/.env"
});


export default {
    entities: [User, Post, Comment, Reply, Hashtag],
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
    },
    debug: true,
    logger: (message) => databaseLogger.info(message)
} as Options;