import mongoose from 'mongoose';
import userModel from './userModel';
const Schema = mongoose.Schema;
const pendingUsers = new Schema({
    idAccount: { type: String, required: true },
    numberCode: { type: Number, required: true },
});
pendingUsers.statics = {
    RegisterPending(data) {
        return this.create(data);
    },

    async RegisterVerify(id, numberCode) {
        try {
            const data = await this.findOne({ _id: id, numberCode: numberCode });
            const { _id, __v, code, ...newUser } = data.toJSON();
            await userModel.createAccount(newUser);
            return true;
        } catch (error) {
            console.log(error);
        }
        // await userModel.createAccount(data)
    },
    createUserPending(idAccount, numberCode) {
        return this.create({ idAccount, numberCode });
    },
    async findUserPending(idUserPendding, numberCode) {
        const checkUser = await this.findOne({ _id: idUserPendding, numberCode });
        if (checkUser) {
            return true;
        }
        return false;
    },
    async findUserAndDelete(IdUserPending) {
        try {
            const data = await this.findOne({ _id: IdUserPending });
            await this.deleteMany({ idAccount: data.idAccount });
            return data;
        } catch (error) {
            console.log(error);
        }
    },
};
export default mongoose.model('pendingUsers', pendingUsers);
