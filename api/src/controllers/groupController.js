import dotenv from 'dotenv';
import groupModel from '../models/groupModel';
dotenv.config();

const createGroup = async (req, res) => {
    const group = {
        name: req.body.name,
        admin: req.user._id,
        groupUsers: req.body.groupUsers,
        avatar: req.body.avatar,
    };
    try {
        const groupCreate = await groupModel.createGroup(group);
        const { __v0, ...myGroup } = groupCreate.toJSON();
        return res.status(200).json(myGroup);
    } catch (error) {
        console.log(error);
        // res.json('false');
    }
};

//  add one user to group
const addUsersToGroup = async (req, res) => {
    try {
        const result = await groupModel.addUser(group, user);
        if (result) {
            return res.status(200).json('Added users to group successfully');
        }
        return res.status(403).json('Add users to group failed');
    } catch (error) {
        return res.status(403).json('Add users to group failed');
    }
};

const getAllGroup = async (req, res) => {
    try {
        const result = await groupModel.getAllGroup(req.user._id);
        console.log(result);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(403).json('not found');
    }
};

const leaveGroup = async (req, res) => {
    try {
        await groupModel.leaveGroup(req.user._id, req.body.groupId);
        return res.status(200).json('leave group successfully');
    } catch (error) {
        return res.status(403).json('not found');
    }
};

const getCustomAvatarGroup = (req, res) => {
    const avatars = [];
    for (let i = 0; i < 12; i++) {
        avatars.push({ avatar: `${process.env.AVATAR_GROUP_CUSTOM}/${i}.png` });
    }
    return res.status(200).json(avatars);
};
export { getCustomAvatarGroup, getAllGroup, addUsersToGroup, createGroup, leaveGroup };
