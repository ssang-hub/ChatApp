import dotevn from 'dotenv';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel';
import refreshTokenModel from '../models/refreshTokenModel';
import * as authJWT from '../middleware/JsonWebToken';
import { mailVerify } from '../middleware/accountMiddleware';

dotevn.config();

const changePassword = async (req, res) => {
    try {
        await userModel.checkPassword(req.user._id, req.body.oldPassword);
        await userModel.updatePassword(req.user._id, req.body.newPassword);
    } catch (error) {
        return res.status(400).json('password is incorrect');
    }
};

const login = async (req, res) => {
    try {
        const userInfo = await userModel.login(req.body.user);
        // Generate an access token
        const { accessToken, refreshToken } = authJWT.createNewToken(userInfo);
        return res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        return res.status(403).json('account or password is incorrect');
    }
};

const logout = async (req, res) => {
    try {
        await refreshTokenModel.findAndDeleteRefreshToken(req.headers['authorization'].split(' ')[1]);
        return res.status(200).json('Logout success');
    } catch (error) {
        return res.status(400).json('Logout failure');
    }
};

const refreshToken = async (req, res) => {
    const { iat, ...user } = req.user;
    try {
        const { accessToken, refreshToken } = await authJWT.createNewToken(user);
        // refreshTokenModel.findOneAndUpdate({info: req.headers.Authorization})
        return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.log(error);
    }
};

const register = async (req, res) => {
    try {
        const accountInfo = {
            fullName: req.body.user.fullName,
            local: {
                hash: req.body.user.password,
                accountName: req.body.user.accountName,
            },
        };

        // check account already exist
        if (await userModel.findOne({ 'local.accountName': accountInfo.local.accountName })) {
            return res.status(403).json('account already exist');
        } else {
            await userModel.createAccount(accountInfo);
            return res.status(200).json('register success');
        }
    } catch (error) {
        return res.status(400).json('register failure');
    }
};

const forgotPassword = async (req, res) => {
    try {
        // After checking if the email exists in the database, server generates a url and send to user mail
        const account = await userModel.findOne({ 'local.email': req.body.email }, { _id: 1 });
        const token = jwt.sign(account.toJSON(), process.env.JWT_SECRET_KEY, {
            expiresIn: '3m',
        });
        await mailVerify(req.body.email, `${process.env.RESET_PASSWORD_URL}/${token}`, 'forgotPassword');
        return res.status(200).json('password reset link sended to your email');
    } catch (error) {
        return res.status(403).json(false);
    }
};

const checkURLReset = async (req, res, next) => {
    // function is used to check the expiry of the url
    try {
        const decode = jwt.verify(req.query.token, process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();
    } catch (error) {
        res.status(404).json('url is expired');
    }
};

const URLIsChecked = (req, res) => {
    res.status(200).json(true);
};

const resetPassword = async (req, res) => {
    try {
        const updateResult = await userModel.updatePassword(req.user._id, req.body.password);
        if (updateResult) {
            return res.status(200).json(true);
        }
    } catch (error) {
        return res.status(403).json(false);
    }
};

export {
    changePassword,
    checkURLReset,
    forgotPassword,
    login,
    logout,
    register,
    refreshToken,
    resetPassword,
    URLIsChecked,
};
