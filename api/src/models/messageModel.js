import mongoose from 'mongoose';
import groupModel from './groupModel';
const ObjectId = mongoose.Types.ObjectId;

const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema({
    senderId: { type: ObjectId },
    receiverId: { type: ObjectId },
    message: {
        type: { type: String, default: 'text' },
        content: String,
    },

    createdAt: { type: Date, default: Date.now },
    deleteAt: { type: Date, default: null },
});

MessageSchema.statics = {
    getMessages(users, p) {
        return this.find({ senderId: { $in: users }, receiverId: { $in: users } })
            .sort({ createdAt: -1 })
            .skip(p * 15)
            .limit(15);
    },
    async getAllMessagesGroup(user, groupId) {
        console.log(await groupModel.checkUserInGroups(user, groupId));
        // if (groupModel.checkUserInGroups(user, groupId)) return this.find({ receiverId: groupId });
    },
    async createMessage(data) {
        const result = await this.create({
            senderId: ObjectId(data.from),
            receiverId: ObjectId(data.to),
            message: data.message,
        });

        return result.toJSON();
    },
};
export default mongoose.model('messages', MessageSchema);
