"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

// import db from '../models';
_dotenv["default"].config();

var Auth = /*#__PURE__*/function () {
  function Auth() {
    (0, _classCallCheck2["default"])(this, Auth);
  }

  (0, _createClass2["default"])(Auth, null, [{
    key: "verifyToken",
    value: function verifyToken(req, res, next) {
      var bearerHeader = req.headers.authorization || req.query.token;

      if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;

        _jsonwebtoken["default"].verify(req.token, process.env.JWT_SECRET, function (err, data) {
          console.log('auth data', data);

          if (err) {
            res.status(403).send('You are not authorized to access this page');
          } else {
            req.user = data.username;
            req.email = data.email;
            req.adminStatus = data.isAdmin;
            next();
          }
        });
      } else {
        res.status(403).json({
          status: 403,
          message: 'Forbidden'
        });
      }
    }
  }]);
  return Auth;
}();

var _default = Auth;
exports["default"] = _default;