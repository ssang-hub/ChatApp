"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _passport = _interopRequireDefault(require("../controllers/passport"));
var _user = _interopRequireDefault(require("./user"));
var _auth = _interopRequireDefault(require("./auth"));
var _test = _interopRequireDefault(require("./test"));
var _multer = _interopRequireDefault(require("multer"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var route = _express["default"].Router();
// const upload = multer({ dest: "src/public/images/message/" });

// // google login
// route.get("/login/google", passport.authenticate("google", { scope: ["email", "profile"] }, { session: false }), (req, res, next) => {
//   console.log(req.user._id);
// });
// route.get("/oauth2/redirect/google", passport.authenticate("google", { failureRedirect: "/OauthFaild", session: false }), genToken);
route.use(_auth["default"]);
route.use(_test["default"]);
route.use(_passport["default"].authenticate('jwt', {
  session: false
}), _user["default"]);
var _default = route;
exports["default"] = _default;