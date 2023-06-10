// import userModel from '../models/userModel';
import friendRequestModel from '../models/friendRequestModel';
import ContactModel from '../models/ContactModel';
import messageModel from '../models/messageModel';
// import groupModel from '../models/groupModel';

const addFriend = async (msg) => {
    try {
        const Request = await friendRequestModel.createRequest(msg.from, msg.to);

        /* create a first message from sender */
        const msgData = {
            content: msg.message,
            type: 'text',
        };
        let firstMessage = msg;
        firstMessage.message = msgData;
        await ContactModel.updateRecent(firstMessage);
        await messageModel.createMessage(firstMessage);

        return true;
    } catch (error) {
        console.log(error);
    }
};

// // Create new Group Chat
const addGroup = async (req, res) => {
    const user = req.user;
    const data = req.body.users;
    const admin = { _id: user._id, userName: user.userName, avatar: user.image };
    data.push(admin);
    const group = {
        name: req.body.name,
        admin,
        users: data,
    };
    try {
        await groupModel.addGroup(group);
        res.json('true');
    } catch (error) {
        res.json('false');
    }
};

// //  add one user to group
// const addUserToGroup = async (req, res) => {
//     const admin = req.user;
//     const user = req.body.users;
//     const group = req.body.groupId;
//     try {
//         const result = await groupModel.addUser(group, user);
//         res.json(result);
//     } catch (error) {
//         console.log('ERROR:', error);
//     }
// };
export { addFriend };
