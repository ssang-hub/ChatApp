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
    socket.on('send-sticker', async (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        const { content, ...newMessage } = data;
        newMessage.message = { type: 'sticker', content: content };
        const msg = await messageService.addMessage(newMessage);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('sticker-receive', msg);
        }
    });
};
export default chatText;
