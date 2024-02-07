import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import ejs from 'ejs';
import path from 'path';

import friendRequestModel from '../models/friendRequestModel';

const mailVerify = async (email, url, option) => {
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
        const html = template({ url: url });
        let message = {
            from: 'AppChat <chatappsang148@gmail.com>',
            to: `Recipient <${email}>`,
            subject: option === 'forgotPassword' ? 'Khôi phục mật khẩu' : 'Xác nhận tài khoản',
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

const checkImageUpload = (req, res, next) => {
    console.log(req.file);
    // next();
    res.status(403).json(false);
    return;
};

const verifyMyEmail = async (req, res, next) => {
    try {
        const data = req.body;
        const checkUser = await friendRequestModel.findUserPending(data.id, data.numberCode);
        checkUser ? res.status(200).json(true) : res.status(403).json(false);
    } catch (error) {
        res.status(403).json(false);
    }
};

export { checkImageUpload, mailVerify };
