"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _ParcelsController = _interopRequireDefault(require("../controllers/ParcelsController"));

var _auth = _interopRequireDefault(require("../middleware/auth"));

var router = _express["default"].Router();

router.use(_express["default"].json());
router.get('/', _auth["default"].verifyToken, _ParcelsController["default"].getAll);
router.get('/:id', _auth["default"].verifyToken, _ParcelsController["default"].getOne);
router.post('/', _auth["default"].verifyToken, _ParcelsController["default"].create);
router.patch('/:id/cancel', _auth["default"].verifyToken, _ParcelsController["default"].cancel);
router.patch('/:id/destination', _auth["default"].verifyToken, _ParcelsController["default"].changeDestination);
router.patch('/:id/location', _auth["default"].verifyToken, _ParcelsController["default"].changeCurrentLocation);
router.patch('/:id/status', _auth["default"].verifyToken, _ParcelsController["default"].changeStatus);
var _default = router;
exports["default"] = _default;