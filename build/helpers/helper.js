"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var Helper = {
  hashPassword: function hashPassword(password) {
    return _bcrypt["default"].hashSync(password, _bcrypt["default"].genSaltSync(16));
  },
  comparePassword: function comparePassword(hashPassword, password) {
    return _bcrypt["default"].compareSync(password, hashPassword);
  },
  isValidEmail: function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  generateToken: function generateToken(payload) {
    var token = _jsonwebtoken["default"].sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3d'
    });

    return token;
  }
};
var _default = Helper;
exports["default"] = _default;
//# sourceMappingURL=helper.js.map