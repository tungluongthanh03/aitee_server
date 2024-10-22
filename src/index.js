import express from 'express';
import loader from './loader/index.js';
import { port } from './config/index.js';

const app = express();

function isPortInUse(port) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            server.close(() => resolve(false));
        });
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true);
            } else {
                reject(err);
            }
        });
    });
}

async function startServer(port) {
    try {
        let currentPort = port;
        while (await isPortInUse(currentPort)) {
            console.log(`Port ${currentPort} is in use, trying ${currentPort + 1}...`);
            currentPort++;
        }

        await loader(app);

        app.listen(currentPort, () => {
            console.log(`App listening at http://localhost:${currentPort}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(port);
