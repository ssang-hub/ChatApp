import express from 'express';

import * as authController from '../controllers/authController';
import { googleVerify } from '../controllers/socialAuth';

const route = express.Router();
route.post('/register', authController.register);
route.post('/verifyRegister', authController.verifyRegister);
route.post('/login', authController.login);
route.post('/logout', authController.logout);

route.post('/sendImage', (req, res) => {
    console.log(req.files);
});
route.post('/googleVerify', googleVerify);
route.post('/forgotPassword', authController.forgotPassword);
route.post('/verifyRecoveryPassword', authController.verifyRecoveryPassword);
route.put('/recoveryPassword', authController.recoveryPassword);
export default route;
