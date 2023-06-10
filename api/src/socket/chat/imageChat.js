import fs from 'fs-extra';
import path from 'path';
import { HmacSHA256 } from 'crypto-js';
import * as messageService from '../../service/messageService';
import dotenv from 'dotenv';
dotenv.config();
import { v4 as uuidv4 } from 'uuid';
const ImageChat = (socket) => {
    socket.on('send-image', async (data) => {
        try {
            const recieverUser = onlineUsers.get(data.to); //undefined
            const sender = onlineUsers.get(data.from); //undefined
            const buffer = Buffer.from(data.content, 'base64');
            const fileName = uuidv4().toString();
            await fs.writeFile(path.join(path.resolve(), 'src/public/images/message') + '/' + fileName, buffer);

            const { content, ...MessageData } = data;
            MessageData.message = { type: 'image', content: `${process.env.IMAGE_FOLDER}/${fileName}` };
            const msg = await messageService.addMessage(MessageData);
            socket.to(sender).emit('send-image-success', MessageData);
            socket.to(recieverUser).emit('image-receive', MessageData);
        } catch (error) {
            console.log(error);
        }
        // console.log(data.content);
        // console.log(data);
        // const sendUserSocket = onlineUsers.get(data.to);
        // writeFile("../../public/images/message/", data.content, (err) => {
        //   console.log(err);
        // });
        // if (sendUserSocket) {
        //   socket.to(sendUserSocket).emit("msg-recieve", data);
        // }
    });
};
export default ImageChat;
