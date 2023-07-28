import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Contact = new Schema({
    from: { type: ObjectId },
    to: { type: ObjectId },
    lastUserSend: {
        avatar: { type: String },
        userName: { type: String },
    },
    content: { type: String },
    updateAt: { type: Date },
});
Contact.statics = {
    async updateRecent(messageData) {
        let content;
        if (messageData.message.type === 'text') {
            content = messageData.message.content;
        } else if (messageData.message.type === 'image') {
            content = 'Đã gửi một ảnh';
        } else if (messageData.message.type === 'video') {
            content = 'Đã gọi';
        }
        try {
            if (messageData.lastUserSend) {
                // console.log('update ở đây');
                // const test = await this.updateMany(
                //     { to: ObjectId(messageData.to) },
                //     { content: content, updateAt: Date.now(), lastUserSend: messageData.lastUserSend },
                // );
                // console.log(test);
            } else {
                await this.findOneAndUpdate(
                    {
                        from: { $in: [ObjectId(messageData.from), ObjectId(messageData.to)] },
                        to: { $in: [ObjectId(messageData.from), ObjectId(messageData.to)] },
                    },
                    {
                        from: ObjectId(messageData.from),
                        to: ObjectId(messageData.to),
                        content: content,
                        updateAt: Date.now(),
                    },
                    { upsert: true, returnOriginal: false },
                );
            }
            return true;
            // console.log(test);
        } catch (error) {
            return false;
        }
    },
    getRecentContact(userId) {
        return this.find({ $or: [{ from: userId }, { to: userId }] })
            .sort({ updateAt: -1 })
            .skip(0)
            .limit(10);
    },
    createContactGroup(groupUsers, groupId, lastUserSend) {
        const newContacts = groupUsers.map((item) => {
            return {
                from: item,
                to: groupId,
                content: 'Bạn đã được thêm vào nhóm',
                updateAt: Date.now(),
                lastUserSend: lastUserSend,
            };
        });
        // console.log('new Contact:', newContacts);
        this.create(newContacts);
    },
};

export default mongoose.model('contacts', Contact);
