import express from 'express';
import route from './routes.js';

import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT_SERVER || 3001;

const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  user: 'yourUsername',
  password: 'yourPassword',
  database: 'chat_app'
});


// middleware xử lý dữ liệu từ form submit lên server. Phải có thì req.body mới có data
app.use(express.urlencoded({ extended: true }));
// Gửi từ code JS lên
app.use(express.json());

// 
route(app);

// Khởi tạo server với cổng đã được xác định
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
  
  // Xử lý sự kiện 'error' nếu cổng đã được sử dụng
  app.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use`);
      const newPort = +port + 1;
      app.listen(newPort, () => {
        console.log(`App listening at http://localhost:${newPort}`);
      });
    } else {
      console.error('Error starting server:', err);
    }
  });