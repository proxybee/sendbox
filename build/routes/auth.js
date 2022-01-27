"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _UsersController = _interopRequireDefault(require("../controllers/UsersController"));

_dotenv["default"].config();

var router = _express["default"].Router();

router.use(_express["default"].json());
router.post('/signup', _UsersController["default"].signup);
router.post('/login', _UsersController["default"].login);
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=auth.js.map