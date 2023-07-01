import messageModel from '../models/messageModel';

// const getAllMessages = async (req, res) => {
//   const sender = jwt_decode(req.headers.authorization);
//   const reciever = req.body.reciever;
//   try {
//     const data = await messageModel.getAllMessages([sender._id, reciever]);
//     res.json(data);
//   } catch (error) {
//     console.log("ERROR: " + error);
//   }
// };
const getMessages = async (req, res) => {
    try {
        const result = await messageModel.getMessages([req.query.u, req.user._id], req.query.p);

        const messages = result.map((item) => {
            const date = new Date(item.createdAt);
            return {
                from: item.senderId,
                to: item.receiverId,
                message: item.message,
                createdAt: `${date.getHours()}:${date.getMinutes()} | ${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}`,
            };
        });
        return res.status(200).json(messages.reverse());
    } catch (error) {
        console.log(error);
    }
};

const getGroupMessages = async (req, res) => {
    try {
        const result = await messageModel.getGroupMessages(req.query.groupId, req.query.p);
        const messages = result.map((item) => {
            const date = new Date(item.createdAt);
            return {
                ...item,
                createdAt: `${date.getHours()}:${date.getMinutes()} | ${date.getDate()}-${
                    date.getMonth() + 1
                }-${date.getFullYear()}`,
            };
        });
        return res.status(200).json(messages.reverse());
    } catch (error) {
        console.log(error);
    }
};

const removeMessage = async (req, res) => {};
export { removeMessage, getMessages, getGroupMessages };
