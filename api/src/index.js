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
        // origin: true,
        credentials: true,
    },
});

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(path.resolve(), 'src/public')));

// async function startServer() {
//   try {
//     await server.start();
//     server.applyMiddleware({ app });
//   } catch (error) {
//     console.log(error);
//   }
// }
// startServer();

//login
app.use(passport.initialize());
// app.use(router);
app.use(route);
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
// server;
global.onlineUsers = new Map();
socketService(io, global);

//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });
//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data);
//     }
//   });
//   // socket.on("disconnect", (reason) => {
//   //   console.log("user disconnected");
//   // });
//   //.to(sendUserSocket)
// });

server.listen(process.env.PORT, () => {
    console.log('Server is running');
});
