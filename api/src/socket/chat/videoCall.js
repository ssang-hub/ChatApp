import userModel from '../../models/userModel';
import { v4 as uuidv4 } from 'uuid';
const videoChat = (socket) => {
    socket.on('create-video-chat', async (msg) => {
        try {
            const roomId = uuidv4();
            const Callfrom = await userModel.findOne({ _id: msg.from }, { userName: 1, avatar: 1 });
            const CallTo = onlineUsers.get(msg.to);
            socket.join(roomId);
            socket.to(onlineUsers.get(msg.from)).emit('created-video-chat-room', { roomId });
            socket.to(CallTo).emit('receive-video-call', { Callfrom, roomId });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('accept-video-call', (roomId) => {
        socket.join(roomId);
    });
    socket.on('refuse-video-call', (IdAccountCall) => {
        socket.leave();
    });
    socket.on('leave-video-call', (IdAccountCall) => {
        socket.leave();
    });
};
export default videoChat;
