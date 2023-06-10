import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const groupSchema = new Schema({
    name: { type: String },
    groupUsers: [{ _id: ObjectId }],
    admin: { _id: ObjectId },
    avatar: { type: String, default: `${process.env.DOMAIN}/images/group-default.png` },
});

groupSchema.statics = {
    createGroup(data) {
        return this.create(data);
    },
    async addNewUsers(groupId, users, useradd) {
        try {
            const checkUser = await this.findOne({ groupUsers: useradd, _id: groupId });
            if (checkUser) {
                await this.updateOne({ _id: groupId }, { $push: { groupUsers: users } });
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    },
    getAllGroup(userId) {
        return this.find({ groupUsers: userId });
    },
};
export default mongoose.model('groups', groupSchema);
