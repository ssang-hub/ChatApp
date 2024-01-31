import express from 'express';
const app = express();
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import socketService from './socket';
const { Server } = require('socket.io');
const server = http.createServer(app);
import cors from 'cors';

import route from './routes';
import connectDB from './config/Database';
import passport from './controllers/passport';

dotenv.config();

const io = new Server(server, {
    cors: {
        origin: `${process.env.CLIENT_APP}`,
        credentials: true,
    },
});

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(path.resolve(), 'src/public')));

app.use(passport.initialize());
app.use(route);
global.onlineUsers = new Map();
socketService(io, global);

server.listen(process.env.PORT, () => {
    console.log('Server is running');
});
