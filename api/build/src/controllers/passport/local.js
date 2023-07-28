"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _passportJwt = require("passport-jwt");
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
_dotenv["default"].config();
var jwtSrategy = new _passportJwt.Strategy({
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: process.env.JWT_SECRET_KEY
}, function (jwt_payloads, done) {
  try {
    return done(null, jwt_payloads);
  } catch (error) {
    console.log('error: ' + error);
    done(error, false);
  }
});
var _default = jwtSrategy;
exports["default"] = _default;