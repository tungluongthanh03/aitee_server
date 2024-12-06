import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import loader from './loader/index.js';
import { port } from './config/index.js';
import { initializeSocket } from './services/socket/index.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3001', 'http://localhost:3002'], // Add more URLs here
        methods: ['GET', 'POST'],
    },
});

initializeSocket(io);

function isPortInUse(port) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            server.close(() => resolve(false));
        });
        app.on('error', (err) => {
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

        server.listen(currentPort, () => {
            console.log(`App listening at http://localhost:${currentPort}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer(port);
