import dotevn from 'dotenv';
import { HmacSHA1 } from 'crypto-js';
import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import ejs from 'ejs';
import path from 'path';

import userModel from '../models/userModel';
import pendingUserModel from '../models/pendingUserModel';
import refreshTokenModel from '../models/refreshTokenModel';
import * as authJWT from '../middleware/JsonWebToken';

dotevn.config();
const mailVerify = async (email, codeNumber, option) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILADMIN,
                pass: process.env.PASSMAILADMIN,
            },
        });

        const template = ejs.compile(
            fs.readFileSync(
                path.join(
                    path.resolve(),
                    option === 'forgotPassword' ? 'src/views/recoveryPassword.ejs' : 'src/views/sendMail.ejs',
                ),
                'utf-8',
            ),
        );
        const html = template({ code: codeNumber });
        let message = {
            from: 'AppChat <chatappsang148@gmail.com>',
            to: `Recipient <${email}>`,
            subject: option === 'forgotPassword' ? 'Khôi phục mật khẩu' : 'Xác nhận tài khoản',
            text: 'Hello to myself!',

            html: html,
        };
        transporter.sendMail(message, (err, info) => {
            if (err) {
                // console.log("Error occurred. " + err.message);
                // process.exit(1);
                return false;
            } else {
                console.log('sendding,...');

                console.log('Message sent: %s', info.response);
            }
        });
    } catch (error) {
        // console.log(error);
        return false;
    }
};

const login = async (req, res, next) => {
    try {
        const data = {
            accountName: req.body.user.accountName,
            hash: HmacSHA1(req.body.user.password, process.env.CRYPTO_KEY).toString(),
        };
        const result = await userModel.login(data);
        if (result) {
            //Generate an access token
            const { __v, ...data } = result;
            const { accessToken, refreshToken } = authJWT.createNewToken(data._doc);
            const refresh = refreshTokenModel.createRefreshToken(refreshToken);
            return res.status(200).json({
                accessToken,
                refreshToken,
            });
        } else {
            return res.status(403).json('Tài khoản mật khẩu không chính xác');
        }
    } catch (error) {
        return res.status(403).json('Tài khoản mật khẩu không chính xác');
    }
};
const logout = async (req, res) => {
    try {
        refreshTokenModel.findAndDeleteRefreshToken(req.body.token);
    } catch (error) {
        return res.status(400).json('Logout failed');
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
const register = async (req, res, next) => {
    try {
        const infromation = req.body.user;
        const accountCreate = {
            userName: infromation.userName,
            local: {
                hash: HmacSHA1(infromation.password, process.env.CRYPTO_KEY).toString(),
                accountName: infromation.accountName,
            },
        };
        if (await userModel.checkAccountName(accountCreate.local.accountName)) {
            return res.status(403).json('faild');
        } else {
            await userModel.createAccount(accountCreate);
            return res.status(200).json('success');
        }

        // check account already exist
        // const checkAccount = await userModel.findUserByEmail(infromation.email);
        // if (checkAccount) {
        //   res.json(false);
        // } else {
        //   const codeNumber = Math.round(Math.random() * 1000000);
        //   const result = await pendingUserModel.RegisterPedding({ ...accountCreate, code: codeNumber });
        //   await mailVerify(infromation.email, codeNumber);
        //   res.status(200).json(result._id);
        // }
        // const result = await userModel.RegisterAccount(accountCreate);
        // return result ? res.json(true) : res.json(false);
        // console.log(result);
    } catch (error) {
        console.log(error);
    }

    // const findUserInDb = await userModel.findUserByName(user.userName);
    // if (findUserInDb) {
    //   return res.json({ success: false });
    // }
    // const createUser = await userModel.createUser(user);
    // // const addPublicKey = await publicKey.addPublicKey({ user: user.userName, key: infromation.publicKey });
    // return res.json({ success: true });
};
const verifyRegister = async (req, res) => {
    try {
        const data = req.body;
        const result = await pendingUserModel.RegisterVerify(data.pendingUserModel, data.numberCode);
        if (result) {
            return res.status(200).json(true);
        } else {
            return res.status(404).json(false);
        }
    } catch (error) {
        console.log(error);
    }
};
// verify email
const verifyEmail = async (req, res) => {};
// handle forgot password
const forgotPassword = async (req, res) => {
    try {
        const numberCode = Math.round(Math.random() * 1000000);
        const checkEmail = await userModel.findUserByEmail(req.body.recoveryEmail);
        if (checkEmail) {
            await mailVerify(req.body.recoveryEmail, numberCode, 'forgotPassword');
            const user = await pendingUserModel.createUserPedding(checkEmail._id.toString(), numberCode);
            return res.status(200).json(user._id);
        } else {
            return res.status(403).json(false);
        }
    } catch (error) {
        return res.status(403).json(false);
    }
};
// verify Number Code in email
const verifyRecoveryPassword = async (req, res) => {
    try {
        const data = req.body.dataRecovery;
        const checkUser = await pendingUserModel.findUserPedding(data.id, data.numberCode);
        return checkUser ? res.status(200).json(true) : res.status(403).json(false);
    } catch (error) {
        return res.status(403).json(false);
    }
};
// after user enter NumberCode
const recoveryPassword = async (req, res) => {
    try {
        // pendingUserModel.find
        const result = await pendingUserModel.findUserAndDelete(req.body.datasend.id);
        const hash = HmacSHA1(req.body.datasend.password, process.env.CRYPTO_KEY).toString();
        const updateResult = await userModel.updatePasswordAccount(result.idAccount, hash);
        if (updateResult) {
            return res.status(200).json(true);
        }
        userModel.updatePassword();
    } catch (error) {
        return res.status(403).json(false);
    }
};

export {
    forgotPassword,
    login,
    logout,
    register,
    refreshToken,
    recoveryPassword,
    verifyRegister,
    mailVerify,
    verifyRecoveryPassword,
};
