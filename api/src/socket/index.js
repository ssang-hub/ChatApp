import chatText from './chat/ChatText';
import ImageChat from './chat/imageChat';
import videoChat from './chat/videoCall';
import fiendSocketService from './contact/friend';
import groupSocketService from './contact/groups';

const service = (io, global) => {
    io.on('connection', (socket) => {
        // socket.join("SangOcCho", "h18d52GzpWBeTVExAAAB");
        // console.log(io.sockets.adapter.rooms);
        global.chatSocket = socket;
        socket.on('accountConnect', (userId) => {
            // console.log(userId);
            onlineUsers.set(userId, socket.id);
        });
        chatText(socket);
        ImageChat(socket);
        fiendSocketService(socket);
        groupSocketService(socket);
        videoChat(socket);
        // socket.on("disconnect", (reason) => {
        //   console.log("user disconnected");
        // });
        //.to(sendUserSocket)
    });
};
export default service;
