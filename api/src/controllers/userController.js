import userModel from '../models/userModel';
import friendRequestModel from '../models/friendRequestModel';
import ContactModel from '../models/ContactModel';
// import { mailVerify } from './authController';

// Create new Group Chat

// get information myself
const getInformation = async (req, res) => {
    const user = req.user;
    const result = await userModel.findOne({ userName: user.userName });
    res.json(result);
};
const getAllFriend = async (req, res) => {
    try {
        const result = await userModel.getAllFriend(req.user._id);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
    }
};

const getAllUser = async (req, res) => {
    const result = await userModel.getAllUser();
    res.json(result);
};

const searchUser = async (req, res) => {
    try {
        const resultSearchUser = await userModel.searchUsers(req.body.friend, req.user._id);
        const myRequest = await friendRequestModel.MyRequest(req.user._id);
        if (resultSearchUser) {
            const requestData = myRequest.map((item) => {
                return item.to.toString();
            });

            let responseData = [];

            for (let v of resultSearchUser) {
                if (v._id.toString() !== req.user._id.toString()) {
                    responseData.push({
                        _id: v._id,
                        userName: v.userName,
                        avatar: v.avatar,
                        pendingAccept: requestData.includes(v._id.toString()),
                    });
                }
            }

            // console.log(responseData);
            res.status(200).json(responseData);
        }
    } catch (error) {
        console.log(error);
    }
};

const updateMyProfile = async (req, res) => {
    // console.log("ok");
    try {
        let data = req.body.myProfile;

        const result = await userModel.findOneAndUpdate({ _id: req.user._id }, data);
        const newUser = { ...result._doc, ...data };
        // console.log(newUser);
        res.status(200).json(newUser);
        // console.log('ok');
    } catch (error) {
        console.log(error);
    }
};
const getUserInfomation = async (req, res) => {
    // console.log(req.params.userId);
    try {
        const user = await userModel.getUserInfomation(req.params.userId);
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
};
const Request = async (req, res) => {
    try {
        const Requests = await friendRequestModel.getRequest(req.user._id);
        return res.status(200).json(Requests);
    } catch (error) {
        console.log(error);
    }
};
const RequestAccept = async (req, res) => {
    try {
        /*
            delete Request and update friend list
        * */

        const userId = await friendRequestModel.findByIdAndDelete({ _id: req.body.id });
        await userModel.addFriend(userId.from, userId.to);
        await userModel.addFriend(userId.to, userId.from);

        res.status(200).json(true);
    } catch (error) {
        console.log(error);
    }
};
const refuseRequest = async (req, res) => {
    try {
        // console.log(req.body.id);
        await friendRequestModel.findOneAndDelete({ _id: req.body.id });
        res.status(200).json(true);
    } catch (error) {
        console.log(error);
    }
};
const getNumberRequest = async (req, res) => {
    try {
        // const x = await friendRequestModel.count({ to: req.user._id });
        // console.log(x);
        res.status(200).json(await friendRequestModel.count({ to: req.user._id }));
    } catch (error) {
        console.log(error);
    }
};
const getContacts = async (req, res) => {
    try {
        const data = await ContactModel.getRecentContact(req.user._id);
        const userIds = data.map((item) => {
            if (item.from.toString() === req.user._id.toString()) {
                return item.to.toString();
            }
            return item.from.toString();
        });
        const { users, friends } = await userModel.findUsers(userIds, req.user._id);
        const usersData = users.map((user) => {
            const userDetail = user.toJSON();
            return {
                ...userDetail,
                isFriend: friends.some((friend) => friend.toString() === userDetail._id.toString()),
            };
        });
        const contacts = data.map((contact) => {
            const contactObject = {
                _id: contact._id,
                content: contact.content,
                updateAt: contact.updateAt,
                fromSelf: true,
            };
            if (contact.from.toString() === req.user._id.toString()) {
                contactObject.contact = usersData.find((user) => user._id.toString() === contact.to.toString());
                return contactObject;
            }
            contactObject.contact = usersData.find((user) => user._id.toString() === contact.from.toString());
            return contactObject;
        });
        return res.status(200).json(contacts);

        // console.log(data.reverse());
        // console.log(data);
    } catch (error) {
        console.log(error);
    }
};

export {
    refuseRequest,
    getAllFriend,
    getNumberRequest,
    getInformation,
    getAllUser,
    searchUser,
    updateMyProfile,
    getUserInfomation,
    Request,
    RequestAccept,
    getContacts,
};
