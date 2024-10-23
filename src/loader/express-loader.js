import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

import { prefix, jwtSecretKey } from '../config/index.js';
import routes from '../routes/index.js';
import { rateLimiter } from '../middlewares/index.js';

export default (app) => {
    process.on('uncaughtException', async (error) => {
        console.log(error);
    });

    process.on('unhandledRejection', async (ex) => {
        console.log(ex);
    });

    if (!jwtSecretKey) {
        console.error('FATAL ERROR: jwtSecretKey is not defined.');
        process.exit(1);
    }

    app.enable('trust proxy');
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(helmet());
    app.use(compression());
    app.use(express.static('public'));
    app.disable('x-powered-by');
    app.disable('etag');

    app.use(rateLimiter);
    app.use(prefix, routes);

    app.get('/', (_req, res) => {
        return res
            .status(200)
            .json({ message: 'Welcome to the aitee server', version: '1.0.0' })
            .end();
    });

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        );
        res.header('Content-Security-Policy-Report-Only', 'default-src: https:');
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT POST PATCH DELETE GET');
            return res.status(200).json({});
        }
        next();
    });

    app.use((_req, _res, next) => {
        const error = new Error('Endpoint could not find!');
        error.status = 404;
        next(error);
    });

    app.use((error, req, res, _next) => {
        res.status(error.status || 500);
        return res.json({
            error: {
                message: error.message,
                status: error.status || 500,
            },
        });
    });
};
