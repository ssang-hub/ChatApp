import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new Schema({
    userName: { type: String, required: true },
    local: {
        accountName: { type: String, trim: true },
        hash: { type: String },
        email: { type: String, trim: true },
    },
    DOB: { type: Date, default: null },
    gender: { type: String, default: 'Nam' },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    avatar: {
        type: String,
        default: `${process.env.DOMAIN}/images/randomAvatar/${Math.round(Math.random() * 39)}.svg`,
    },
    coverAvatar: { type: String, default: `${process.env.DOMAIN}/images/imageCover.png` },
    socialAuth: { type: String, default: '' },
    groups: [],
    friends: [{ type: ObjectId, default: null }],
});

userSchema.statics = {
    addFriend(Uid, friendId) {
        return this.updateOne({ _id: Uid }, { $push: { friends: friendId } });
    },
    async RegisterAccount(account) {
        try {
            const email = account.local.email;
            const checkAccount = await this.findOne({ 'local.email': email }).exec();
            if (!checkAccount) {
                return this.createUser(account);
            }
            return false;
        } catch (error) {
            console.log(error);
        }
        // return this.findOne({ "local.email": { account } });
    },
    async updatePasswordAccount(idAccount, hash) {
        try {
            const updateResult = await this.updateOne({ _id: idAccount }, { 'local.hash': hash });
            if (updateResult) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    },
    createAccount(accout) {
        return this.create(accout);
    },
    checkAccountName(accountName) {
        return this.findOne({ 'local.accountName': accountName });
    },
    login(user) {
        return this.findOne(
            { 'local.accountName': user.accountName, 'local.hash': user.hash },
            { local: 0, socialAuth: 0, friends: 0 },
        );
    },
    async findFriend(userName, friend) {
        try {
            const result = await this.findOne({ userName: userName, friends: { $in: [friend] } });
            if (result) return true;
            return false;
        } catch (error) {
            console.log(error);
        }
    },
    findUserById(id) {
        return this.findOne({ _id: id });
    },
    findUserByName(userName) {
        return this.findOne({ userName: userName });
    },

    async searchUsers(userName, myAccountId) {
        try {
            const myAccount = await this.findOne({ _id: myAccountId }, { friends: 1 });
            const users = await this.find(
                { userName: { $regex: '.*' + userName + '.*' }, _id: { $nin: myAccount.friends } },
                { local: 0, socialAuth: 0, friends: 0 },
            );
            return users;
            // console.log(users);
        } catch (error) {
            console.log(error);
        }
    },
    findUserByEmail(email) {
        return this.findOne({ 'local.email': email }, { _id: 1 }).exec();
    },
    createUser(infromation) {
        return this.create(infromation);
    },
    getAllUser() {
        return this.find({});
    },
    getContactInformation(userIds) {
        return this.find({ _id: { $in: userIds } }).exec();
    },
    async getAllFriend(UserId) {
        try {
            const myAccount = await this.findOne({ _id: UserId }, { friends: 1 });
            // console.log(myAccount.friends);
            const result = await this.find({ _id: { $in: myAccount.friends } }, { userName: 1, avatar: 1 });
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    async SocialLogin(payload) {
        try {
            const user = await this.findOneAndUpdate(
                { socialAuth: payload.sub },
                {
                    socialAuth: payload.sub,
                    userName: payload.name,
                    avatar: payload.picture,
                },
                { upsert: true, returnOriginal: false },
            );
            const { local, socialAuth, friends, ...SocialUser } = user.toJSON();
            return SocialUser;
        } catch (error) {
            console.log();
            console.log(error);
            // console.log('error');
        }
    },
    getUserInfomation(userID) {
        return this.findOne(
            { _id: userID },
            { local: 0, google: 0, facebook: 0, createdAt: 0, updatedAt: 0, deletedAt: 0, friends: 0, groups: 0 },
        );
    },

    async findUsers(userIds, myUserId) {
        try {
            const users = await this.find({ _id: { $in: userIds } }, { userName: 1, avatar: 1 });
            const friends = await this.findOne({ _id: myUserId }, { friends: 1 });
            return { users, friends: friends.friends };
        } catch (error) {
            console.log(error);
        }
    },
};
export default mongoose.model('users', userSchema);
