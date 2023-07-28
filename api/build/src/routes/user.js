"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var userController = _interopRequireWildcard(require("../controllers/userController"));
var messageController = _interopRequireWildcard(require("../controllers/messageController"));
var authController = _interopRequireWildcard(require("../controllers/authController"));
var groupController = _interopRequireWildcard(require("../controllers/groupController"));
var _multer = _interopRequireDefault(require("multer"));
var _updateAccountMiddleware = require("../middleware/updateAccountMiddleware");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var upload = (0, _multer["default"])({
  dest: 'src/public/images/avatars/'
});
var route = _express["default"].Router();

// message api
// route.post("/getAllMessages", messageController.getAllMessages);
route.get('/getMessages', messageController.getMessages);
route.get('/getGroupMessages', messageController.getGroupMessages);

// route.post('/addMessage', messageController.addMessage);

// route.post("/removeMessage", messageController.removeMessage);

route.get('/getInformation', userController.getInformation);
route.get('/getAllUser', userController.getAllUser);

//
route.get('/getContacts', userController.getContacts);
//
route.get('/getUserInfomation/:userId', userController.getUserInfomation);
route.get('/getAllFriend', userController.getAllFriend);
// route.get('/api/getRoom', );

// group controller
route.post('/createGroup', groupController.createGroup);
route.get('/getUsersInGroup', groupController.getUsersInGroup);
route.get('/getAllCustomAvatarGroup', groupController.getCustomAvatarGroup);
route.post('/addUsersToGroup', groupController.addUsersToGroup);
route.post('/leaveGroup', groupController.leaveGroup);
route.post('/searchUser', userController.searchUser);
route.put('/updateMyProfile', _updateAccountMiddleware.checkEmailUpdate, upload.single('file'), userController.updateMyProfile);
route.post('/RequestAccept', userController.RequestAccept);
route.get('/Request', userController.Request);
route.get('/getNumberRequest', userController.getNumberRequest);
// route.get('/getRecentMessages', userController.getRecentMessages);

route["delete"]('/refuseRequest', userController.refuseRequest);
route.post('/refresh', authController.refreshToken);
var _default = route;
exports["default"] = _default;