import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Contact = new Schema({
    from: { type: ObjectId },
    to: { type: ObjectId },
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
            const test = await this.findOneAndUpdate(
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
};

export default mongoose.model('contacts', Contact);
