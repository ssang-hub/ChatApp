"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Schema = _mongoose["default"].Schema;
var refreshToken = new Schema({
  info: {
    type: String,
    required: true
  }
});
refreshToken.statics = {
  createRefreshToken: function createRefreshToken(token) {
    return this.create({
      info: token
    });
  },
  findRefreshToken: function findRefreshToken(token) {
    return this.findOne({
      info: token
    });
  },
  findAndDeleteRefreshToken: function findAndDeleteRefreshToken(token) {
    return this.findOneAndDelete({
      info: token
    }).exec();
  } // UpdateRefreshToken(refreshToken){
  //   return this.findOneAndUpdate({in})
  // }
};
var _default = _mongoose["default"].model('refreshTokens', refreshToken);
exports["default"] = _default;