import * as ContactService from '../../service/ContactService';
const fiendSocketService = (socket) => {
    socket.on('friend-Request-request', async (msg) => {
        try {
            const msgReceive = onlineUsers.get(msg.to);
            await ContactService.addFriend(msg);

            if (msgReceive) {
                socket.to(msgReceive).emit('friend-Request-receive', 'Bạn nhận được lời mời kết bạn từ: ');
            }
        } catch (error) {
            console.log(error);
        }
        // console.log(msg);
    });
};
export default fiendSocketService;
