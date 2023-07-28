import userModel from '../models/userModel';
import friendRequestModel from '../models/friendRequestModel';
import ContactModel from '../models/ContactModel';
import groupModel from '../models/groupModel';
// import { mailVerify } from './authController';

// Create new Group Chat

const formatDateString = (date) => {
    const DOB = new Date(date);
    return `${DOB.getDate()}-${DOB.getMonth() + 1}-${DOB.getFullYear()}`;
};

// get information myself
const getInformation = async (req, res) => {
    try {
        const result = await userModel.getUserInfomation(req.user._id);
        const userData = { ...result.toJSON(), DOB: formatDateString(result.DOB) };
        // console.log(userData);
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(404).json('not_found');
    }
};
const getAllFriend = async (req, res) => {
    try {
        const result = await userModel.getAllFriend(req.user._id);
        // console.log(result);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json('not_found');
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

            console.log(responseData);
            res.status(200).json(responseData);
        }
    } catch (error) {
        console.log(error);
    }
};

const updateMyProfile = async (req, res) => {
    // console.log("ok");
    try {
        const { changeMyProfile } = req.body;
        const result = await userModel.findOneAndUpdate({ _id: req.user._id }, changeMyProfile, {
            new: true,
            projection: '_id userName DOB gender phone address avatar coverAvatar',
        });

        const newUSerData = { ...result.toJSON(), DOB: formatDateString(result.DOB) };

        return res.status(200).json(newUSerData);
    } catch (error) {
        return res.status(400).json('bad_request');
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

        const groups = await groupModel.findGroupInArray(userIds);
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
            // if recent messages from reqUser => return contact User
            if (
                contact.from.toString() === req.user._id.toString() &&
                usersData.some((user) => user._id.toString() === contact.to.toString())
            ) {
                contactObject.contact = usersData.find((user) => user._id.toString() === contact.to.toString());
            } else if (usersData.some((user) => user._id.toString() === contact.from.toString())) {
                contactObject.fromSelf = false;
                contactObject.contact = usersData.find((user) => user._id.toString() === contact.from.toString());
            } else {
                contactObject.users = contact.lastUserSend;
                contactObject.contact = groups.find((group) => group._id.toString() === contact.to.toString());
                // contactObject.userGroup =
            }
            return contactObject;
        });
        return res.status(200).json(contacts);
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
