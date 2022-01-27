"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

var _UsersController = _interopRequireDefault(require("../controllers/UsersController"));

var router = _express["default"].Router();

router.use(_express["default"].json());
router.get('/', _auth["default"].verifyToken, _UsersController["default"].getAll);
router.get('/:id', _auth["default"].verifyToken, _UsersController["default"].getOne);
router.get('/:id/parcels', _auth["default"].verifyToken, _UsersController["default"].getUserParcels);
router.post('/:id/makeadmin', _auth["default"].verifyToken, _UsersController["default"].makeAdmin);
var _default = router;
exports["default"] = _default;