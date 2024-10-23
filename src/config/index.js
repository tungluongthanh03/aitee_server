export { default as swaggerConfig } from './swagger.config.js';
import dotenv from 'dotenv';
dotenv.config();

const {
    PORT,
    JWT_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY,
    ADMIN_ID,
    DB_HOST,
    DB_NAME,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
} = process.env;

export const port = PORT || 3000;
export const jwtSecretKey = JWT_SECRET_KEY;
export const refreshTokenSecretKey = REFRESH_TOKEN_SECRET_KEY;

export const adminId = ADMIN_ID;

export const db_host = DB_HOST;
export const db_port = DB_PORT;
export const db_name = DB_NAME;
export const db_user = DB_USER;
export const db_password = DB_PASSWORD;

export const prefix = '/api';
export const specs = '/api-docs';
