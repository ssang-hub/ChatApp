"use strict";

var _express = _interopRequireDefault(require("express"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _http = _interopRequireDefault(require("http"));
var _path = _interopRequireDefault(require("path"));
var _socket = _interopRequireDefault(require("./socket"));
var _cors = _interopRequireDefault(require("cors"));
var _routes = _interopRequireDefault(require("./routes"));
var _Database = _interopRequireDefault(require("./config/Database"));
var _passport = _interopRequireDefault(require("./controllers/passport"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
var _require = require('socket.io'),
  Server = _require.Server;
var server = _http["default"].createServer(app);
_dotenv["default"].config();
var io = new Server(server, {
  cors: {
    origin: "".concat(process.env.CLIENT_APP),
    // origin: true,
    credentials: true
  }
});
(0, _Database["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(_express["default"]["static"](_path["default"].join(_path["default"].resolve(), 'src/public')));

// async function startServer() {
//   try {
//     await server.start();
//     server.applyMiddleware({ app });
//   } catch (error) {
//     console.log(error);
//   }
// }
// startServer();

//login
app.use(_passport["default"].initialize());
// app.use(router);
app.use(_routes["default"]);
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
// server;
global.onlineUsers = new Map();
(0, _socket["default"])(io, global);

//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });
//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data);
//     }
//   });
//   // socket.on("disconnect", (reason) => {
//   //   console.log("user disconnected");
//   // });
//   //.to(sendUserSocket)
// });

server.listen(process.env.PORT, function () {
  console.log('Server is running');
});