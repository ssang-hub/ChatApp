import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';
import userModel from '../models/userModel';

dotenv.config();

const checkAvatarFile = (req, res, next) => {
    try {
        req.body = JSON.parse(JSON.stringify(req.body));
        if (req.files.avatar) {
            const avatar = checkImageFile(req.files.avatar[0]);
            req.body = { ...req.body, avatar: avatar };
        }
        if (req.files.coverAvatar) {
            const coverAvatar = checkImageFile(req.files.coverAvatar[0]);
            req.body = { ...req.body, coverAvatar: coverAvatar };
        }
        next();
    } catch (error) {
        return res.status(400).json('bad request');
    }
};

const checkImageFile = (file) => {
    if (file.mimetype.split('/')[0] !== 'image') {
        throw 'file type is not supported';
    }
    if (file.size > 1000000) {
        throw 'file is too large';
    }
    return `${process.env.HOST}/images/avatars/${file.filename}`;
};

const checkEmailExists = async (req, res, next) => {
    try {
        if (!req.body.email) next();
        const user = await userModel.findUserByEmail(req.body.email);
        if (user.length > 0) {
            return res.status(400).json('email already exists');
        }
        next();
    } catch (error) {
        return res.status(400).json('bad request');
    }
};

const mailVerify = async (email, url) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILADMIN,
                pass: process.env.PASSMAILADMIN,
            },
        });

        const template = ejs.compile(
            fs.readFileSync(path.join(path.resolve(), 'src/views/recoveryPassword.ejs'), 'utf-8'),
        );
        const html = template({ url: url });
        let message = {
            from: 'AppChat <chatappsang148@gmail.com>',
            to: `Recipient <${email}>`,
            subject: 'Khôi phục mật khẩu',
            text: 'Hello to myself!',

            html: html,
        };
        transporter.sendMail(message, (err, info) => {
            if (err) {
                return false;
            } else {
                console.log('sendding,...');

                console.log('Message sent: %s', info.response);
            }
        });
    } catch (error) {
        return false;
    }
};

export { mailVerify, checkAvatarFile, checkEmailExists };
