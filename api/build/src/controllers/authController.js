"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyRegister = exports.verifyRecoveryPassword = exports.register = exports.refreshToken = exports.recoveryPassword = exports.mailVerify = exports.logout = exports.login = exports.forgotPassword = void 0;
var _dotenv = _interopRequireDefault(require("dotenv"));
var _cryptoJs = require("crypto-js");
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _ejs = _interopRequireDefault(require("ejs"));
var _path = _interopRequireDefault(require("path"));
var _userModel = _interopRequireDefault(require("../models/userModel"));
var _pendingUserModel = _interopRequireDefault(require("../models/pendingUserModel"));
var _refreshTokenModel = _interopRequireDefault(require("../models/refreshTokenModel"));
var authJWT = _interopRequireWildcard(require("../middleware/JsonWebToken"));
var _excluded = ["__v"],
  _excluded2 = ["iat"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
_dotenv["default"].config();
var mailVerify = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(email, codeNumber, option) {
    var transporter, template, html, message;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          transporter = _nodemailer["default"].createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MAILADMIN,
              pass: process.env.PASSMAILADMIN
            }
          });
          template = _ejs["default"].compile(_fsExtra["default"].readFileSync(_path["default"].join(_path["default"].resolve(), option === 'forgotPassword' ? 'src/views/recoveryPassword.ejs' : 'src/views/sendMail.ejs'), 'utf-8'));
          html = template({
            code: codeNumber
          });
          message = {
            from: 'AppChat <chatappsang148@gmail.com>',
            to: "Recipient <".concat(email, ">"),
            subject: option === 'forgotPassword' ? 'Khôi phục mật khẩu' : 'Xác nhận tài khoản',
            text: 'Hello to myself!',
            html: html
          };
          transporter.sendMail(message, function (err, info) {
            if (err) {
              // console.log("Error occurred. " + err.message);
              // process.exit(1);
              return false;
            } else {
              console.log('sendding,...');
              console.log('Message sent: %s', info.response);
            }
          });
          _context.next = 11;
          break;
        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", false);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function mailVerify(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
exports.mailVerify = mailVerify;
var login = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res, next) {
    var data, result, __v, _data, _authJWT$createNewTok, accessToken, _refreshToken, refresh;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          data = {
            accountName: req.body.user.accountName,
            hash: (0, _cryptoJs.HmacSHA1)(req.body.user.password, process.env.CRYPTO_KEY).toString()
          };
          _context2.next = 4;
          return _userModel["default"].login(data);
        case 4:
          result = _context2.sent;
          if (!result) {
            _context2.next = 12;
            break;
          }
          //Generate an access token
          __v = result.__v, _data = _objectWithoutProperties(result, _excluded);
          _authJWT$createNewTok = authJWT.createNewToken(_data._doc), accessToken = _authJWT$createNewTok.accessToken, _refreshToken = _authJWT$createNewTok.refreshToken;
          refresh = _refreshTokenModel["default"].createRefreshToken(_refreshToken);
          return _context2.abrupt("return", res.status(200).json({
            accessToken: accessToken,
            refreshToken: _refreshToken
          }));
        case 12:
          return _context2.abrupt("return", res.status(403).json('Tài khoản mật khẩu không chính xác'));
        case 13:
          _context2.next = 18;
          break;
        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(403).json('Tài khoản mật khẩu không chính xác'));
        case 18:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 15]]);
  }));
  return function login(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();
exports.login = login;
var logout = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _refreshTokenModel["default"].findAndDeleteRefreshToken(req.body.token);
          _context3.next = 7;
          break;
        case 4:
          _context3.prev = 4;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(400).json('Logout failed'));
        case 7:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[0, 4]]);
  }));
  return function logout(_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();
exports.logout = logout;
var refreshToken = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var _req$user, iat, user, _yield$authJWT$create, accessToken, _refreshToken2;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _req$user = req.user, iat = _req$user.iat, user = _objectWithoutProperties(_req$user, _excluded2);
          _context4.prev = 1;
          _context4.next = 4;
          return authJWT.createNewToken(user);
        case 4:
          _yield$authJWT$create = _context4.sent;
          accessToken = _yield$authJWT$create.accessToken;
          _refreshToken2 = _yield$authJWT$create.refreshToken;
          return _context4.abrupt("return", res.status(200).json({
            accessToken: accessToken,
            refreshToken: _refreshToken2
          }));
        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](1);
          console.log(_context4.t0);
        case 13:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 10]]);
  }));
  return function refreshToken(_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();
exports.refreshToken = refreshToken;
var register = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res, next) {
    var infromation, accountCreate;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          infromation = req.body.user;
          accountCreate = {
            userName: infromation.userName,
            local: {
              hash: (0, _cryptoJs.HmacSHA1)(infromation.password, process.env.CRYPTO_KEY).toString(),
              accountName: infromation.accountName
            }
          };
          _context5.next = 5;
          return _userModel["default"].checkAccountName(accountCreate.local.accountName);
        case 5:
          if (!_context5.sent) {
            _context5.next = 9;
            break;
          }
          return _context5.abrupt("return", res.status(403).json('faild'));
        case 9:
          _context5.next = 11;
          return _userModel["default"].createAccount(accountCreate);
        case 11:
          return _context5.abrupt("return", res.status(200).json('success'));
        case 12:
          _context5.next = 17;
          break;
        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
        case 17:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 14]]);
  }));
  return function register(_x11, _x12, _x13) {
    return _ref5.apply(this, arguments);
  };
}();
exports.register = register;
var verifyRegister = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var data, result;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          data = req.body;
          _context6.next = 4;
          return _pendingUserModel["default"].RegisterVerify(data.pendingUserModel, data.numberCode);
        case 4:
          result = _context6.sent;
          if (!result) {
            _context6.next = 9;
            break;
          }
          return _context6.abrupt("return", res.status(200).json(true));
        case 9:
          return _context6.abrupt("return", res.status(404).json(false));
        case 10:
          _context6.next = 15;
          break;
        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);
        case 15:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[0, 12]]);
  }));
  return function verifyRegister(_x14, _x15) {
    return _ref6.apply(this, arguments);
  };
}();
// verify email
exports.verifyRegister = verifyRegister;
var verifyEmail = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function verifyEmail(_x16, _x17) {
    return _ref7.apply(this, arguments);
  };
}();
// handle forgot password
var forgotPassword = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var numberCode, checkEmail, user;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          numberCode = Math.round(Math.random() * 1000000);
          _context8.next = 4;
          return _userModel["default"].findUserByEmail(req.body.recoveryEmail);
        case 4:
          checkEmail = _context8.sent;
          if (!checkEmail) {
            _context8.next = 14;
            break;
          }
          _context8.next = 8;
          return mailVerify(req.body.recoveryEmail, numberCode, 'forgotPassword');
        case 8:
          _context8.next = 10;
          return _pendingUserModel["default"].createUserPending(checkEmail._id.toString(), numberCode);
        case 10:
          user = _context8.sent;
          return _context8.abrupt("return", res.status(200).json(user._id));
        case 14:
          return _context8.abrupt("return", res.status(403).json(false));
        case 15:
          _context8.next = 20;
          break;
        case 17:
          _context8.prev = 17;
          _context8.t0 = _context8["catch"](0);
          return _context8.abrupt("return", res.status(403).json(false));
        case 20:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 17]]);
  }));
  return function forgotPassword(_x18, _x19) {
    return _ref8.apply(this, arguments);
  };
}();
// verify Number Code in email
exports.forgotPassword = forgotPassword;
var verifyRecoveryPassword = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(req, res) {
    var data, checkUser;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          data = req.body.dataRecovery;
          _context9.next = 4;
          return _pendingUserModel["default"].findUserPending(data.id, data.numberCode);
        case 4:
          checkUser = _context9.sent;
          return _context9.abrupt("return", checkUser ? res.status(200).json(true) : res.status(403).json(false));
        case 8:
          _context9.prev = 8;
          _context9.t0 = _context9["catch"](0);
          return _context9.abrupt("return", res.status(403).json(false));
        case 11:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 8]]);
  }));
  return function verifyRecoveryPassword(_x20, _x21) {
    return _ref9.apply(this, arguments);
  };
}();
// after user enter NumberCode
exports.verifyRecoveryPassword = verifyRecoveryPassword;
var recoveryPassword = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(req, res) {
    var result, hash, updateResult;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return _pendingUserModel["default"].findUserAndDelete(req.body.datasend.id);
        case 3:
          result = _context10.sent;
          hash = (0, _cryptoJs.HmacSHA1)(req.body.datasend.password, process.env.CRYPTO_KEY).toString();
          _context10.next = 7;
          return _userModel["default"].updatePasswordAccount(result.idAccount, hash);
        case 7:
          updateResult = _context10.sent;
          if (!updateResult) {
            _context10.next = 10;
            break;
          }
          return _context10.abrupt("return", res.status(200).json(true));
        case 10:
          _userModel["default"].updatePassword();
          _context10.next = 16;
          break;
        case 13:
          _context10.prev = 13;
          _context10.t0 = _context10["catch"](0);
          return _context10.abrupt("return", res.status(403).json(false));
        case 16:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[0, 13]]);
  }));
  return function recoveryPassword(_x22, _x23) {
    return _ref10.apply(this, arguments);
  };
}();
exports.recoveryPassword = recoveryPassword;