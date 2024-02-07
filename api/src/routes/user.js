import express from 'express';
import * as userController from '../controllers/userController';
import * as messageController from '../controllers/messageController';
import * as authController from '../controllers/authController';
import * as groupController from '../controllers/groupController';
import { checkAvatarFile, checkEmailExists } from '../middleware/accountMiddleware';
import multer from 'multer';

const upload = multer({ dest: 'src/public/images/avatars/', limits: { fileSize: 1000000 } });
const route = express.Router();

route.get('/getMessages', messageController.getMessages);
route.get('/getGroupMessages', messageController.getGroupMessages);

route.get('/myInfo', userController.getMyInfo);

//
route.get('/getContacts', userController.getContacts);
//
route.get('/getUserInfomation/:userId', userController.getUserInfomation);
route.get('/getAllFriend', userController.getAllFriend);

// group controller
route.post('/createGroup', groupController.createGroup);
route.get('/getUsersInGroup', groupController.getUsersInGroup);
route.get('/getAllCustomAvatarGroup', groupController.getCustomAvatarGroup);
route.post('/addUsersToGroup', groupController.addUsersToGroup);
route.post('/leaveGroup', groupController.leaveGroup);

route.post('/searchUser', userController.searchUser);
route.put(
    '/updateMyProfile',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverAvatar', maxCount: 1 },
    ]),
    checkAvatarFile,
    checkEmailExists,
    userController.updateMyProfile,
);

route.post('/RequestAccept', userController.RequestAccept);
route.get('/Request', userController.Request);
route.get('/getNumberRequest', userController.getNumberRequest);

route.delete('/refuseRequest', userController.refuseRequest);

route.post('/refresh', authController.refreshToken);

export default route;
