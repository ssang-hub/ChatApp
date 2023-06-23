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
        // console.log(messages);
        const messages = result.map((item) => {
            return {
                from: item.senderId,
                to: item.receiverId,
                message: item.message,
            };
        });
        // console.log(req.query.p);
        return res.status(200).json(messages.reverse());
    } catch (error) {
        console.log(error);
    }
};
const removeMessage = async (req, res) => {};
export { removeMessage, getMessages };
