import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { db_host, db_port, db_name, db_password, db_user } from './config/index.js';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: db_host,
    port: db_port,
    database: db_name,
    username: db_user,
    password: db_password,
    entities: ['src/models/entities/*.js'],
    synchronize: true,
    logging: true,
    connectTimeout: 10000,
});
