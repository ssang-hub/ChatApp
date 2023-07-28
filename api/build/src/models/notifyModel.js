"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Schema = _mongoose["default"].Schema;
var notify = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    require: true
  },
  read: {
    type: Boolean
  }
}, {
  timestamps: true
});
var _default = _mongoose["default"].model('notifies', notify);
exports["default"] = _default;