import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';

import { db_host, db_port, db_name, db_password, db_user } from './config/index.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: db_host,
    port: db_port,
    database: db_name,
    username: db_user,
    password: db_password,
    entities: ['src/models/entities/*.js'],
    synchronize: true,
    logging: true,
    connectTimeout: 10000,
    // ssl: {
    //     rejectUnauthorized: true,
    //     // ca: readFileSync('certs/ca.pem').toString(),
    // },
});
