import * as messageService from '../../service/messageService';
const chatText = (socket) => {
    socket.on('send-msg', async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        const msg = await messageService.addMessage(data);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', msg);
        }
        console.log('message');
    });
};
export default chatText;
