import chatText from './chat/ChatText';
import ImageChat from './chat/imageChat';
import videoChat from './chat/videoCall';
import fiendSocketService from './contact/friend';
import groupSocketService from './contact/groups';
import Typing from './chat/Typing';
import { getAllGroup } from '../service/ContactService';

const service = (io, global) => {
    io.on('connection', (socket) => {
        // socket.join("SangOcCho", "h18d52GzpWBeTVExAAAB");
        // console.log(io.sockets.adapter.rooms);
        global.chatSocket = socket;
        socket.on('accountConnect', async (userId) => {
            // console.log(userId);
            const groupIds = await getAllGroup(userId);
            for (let v of groupIds) {
                socket.join(v._id.toString());
                onlineUsers.set(v._id.toString(), v._id.toString());
            }
            onlineUsers.set(userId, socket.id);
        });
        chatText(socket);
        ImageChat(socket);
        fiendSocketService(socket);
        groupSocketService(socket);
        videoChat(socket);
        Typing(socket);
    });
};
export default service;
