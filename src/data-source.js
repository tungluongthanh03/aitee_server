import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { db_host, db_name, db_password, db_port, db_user } from './config/index.js';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: db_host,
    port: db_port,
    username: db_user,
    password: db_password,
    database: db_name,
    entities: ['src/models/index.js'],
    synchronize: true,
    logging: true,
    connectTimeout: 10000,
});
