import express from 'express';
import * as userController from '../controllers/userController';
import * as messageController from '../controllers/messageController';
import * as authController from '../controllers/authController';
import * as groupController from '../controllers/groupController';

import multer from 'multer';
// import { checkEmailUpdate, checkImageUpload } from '../middleware/AccountMiddleware';

const upload = multer({ dest: 'src/public/images/avatars/' });
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
    // upload.single('file'), checkImageUpload,
    userController.updateMyProfile,
);

route.post('/RequestAccept', userController.RequestAccept);
route.get('/Request', userController.Request);
route.get('/getNumberRequest', userController.getNumberRequest);

route.delete('/refuseRequest', userController.refuseRequest);

route.post('/refresh', authController.refreshToken);

export default route;
