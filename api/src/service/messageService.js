import messageModel from '../models/messageModel';
// import userModel from '../models/userModel';
import ContactsModel from '../models/ContactModel';
const addMessage = async (msg) => {
    try {
        // console.log(req.file);
        const { __v, deleteAt, ...result } = await messageModel.createMessage(msg);
        // console.log(result);
        const date = new Date(result.createdAt);
        const message = {
            _id: result._id,
            from: result.senderId,
            to: result.receiverId,
            message: result.message,
            createdAt: `${date.getHours()}:${date.getMinutes()} | ${date.getDate()}-${
                date.getMonth() + 1
            }-${date.getFullYear()}`,
        };
        // console.log(message.message);
        // await ContactsModel.updateRecent(message);
        await ContactsModel.updateRecent(message);
        return message;

        // return msg;
    } catch (error) {
        console.log(error);
    }
};
export { addMessage };
