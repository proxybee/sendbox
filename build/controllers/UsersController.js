"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _moment = _interopRequireDefault(require("moment"));

var _uuid = require("uuid");

var _models = _interopRequireDefault(require("../models"));

var _helper = _interopRequireDefault(require("../helpers/helper"));

var _validator = require("../helpers/validator");

_dotenv["default"].config();

var tDate = new Date();

var User = /*#__PURE__*/function () {
  function User() {
    (0, _classCallCheck2["default"])(this, User);
  }

  (0, _createClass2["default"])(User, null, [{
    key: "signup",
    value: function signup(req, res) {
      if (!req.body.email || !req.body.password || req.body.password.length <= 4) {
        return res.status(400).send({
          message: 'Some values are missing'
        });
      }

      if (!_helper["default"].isValidEmail(req.body.email)) {
        return res.status(400).send({
          message: 'Please enter a valid email address'
        });
      }

      var hashedPassword = _helper["default"].hashPassword(req.body.password);

      var newUser = {
        id: (0, _uuid.v4)(),
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        otherNames: req.body.othernames,
        email: req.body.email,
        username: req.body.username,
        isVerified: 'false',
        isAdmin: 'false',
        password: hashedPassword,
        registered: (0, _moment["default"])(tDate).format('MM/DD/YYYY, HH:MM')
      };
      var fieldError = (0, _validator.signUpSchema)(newUser);

      if (fieldError) {
        return res.status(500).send({
          message: fieldError
        });
      }

      var userQuery = "INSERT INTO users (id,firstName,lastName,otherNames,email,username,isVerified,isAdmin,password,registered) \n                    VALUES('".concat(newUser.id, "','").concat(newUser.firstName, "','").concat(newUser.lastName, "','").concat(newUser.otherNames, "','").concat(newUser.email, "',\n                    '").concat(newUser.username, "','").concat(newUser.isVerified, "','").concat(newUser.isAdmin, "','").concat(newUser.password, "','").concat(newUser.registered, "')");

      _models["default"].query(userQuery).then(function (result) {
        if (result.rowCount >= 1) {
          res.status(200).json({
            status: 200,
            message: 'User saved successfully'
          });
        } else if (result.rowCount === 0) {
          res.status(500).json({
            status: 500,
            message: 'The user could not be saved'
          });
        }
      })["catch"](function (error) {
        console.log(error);
        res.status(500).json({
          status: 500,
          'An error occurred while trying to save user': error.detail,
          table: error.table
        });
      });

      return false;
    }
  }, {
    key: "login",
    value: function login(req, res) {
      if ((0, _validator.loginSchema)(req.body)) {
        return res.status(400).send({
          message: 'Either email or password is missing or incorrect'
        });
      }

      var loginData = {
        email: req.body.email,
        password: req.body.password,
        lastLogin: (0, _moment["default"])(tDate).format('MM/DD/YYYY, HH:MM')
      };
      var query = "SELECT * FROM users WHERE email='".concat(loginData.email, "'");

      _models["default"].query(query).then(function (result) {
        if (result.rowCount === 0) {
          res.status(400).json({
            status: 400,
            error: 'An error occurred while trying to log you in Check your details again'
          });
        } else if (result.rowCount >= 1) {
          if (!_helper["default"].comparePassword(result.rows[0].password, req.body.password)) {
            res.status(400).json({
              message: 'The credentials you provided are incorrect'
            });
          }

          var tokenData = {
            id: result.rows[0].id,
            isAdmin: result.rows[0].isadmin,
            username: result.rows[0].username,
            email: result.rows[0].email
          };
          delete loginData.password;

          var token = _helper["default"].generateToken(tokenData);

          res.status(200).json({
            token: token,
            message: 'Login successful'
          });
        }
      })["catch"](function (error) {
        console.log('The login error', error);
        res.status(500).json({
          status: 500,
          error: 'This is an internal server error, try again later again'
        });
      });

      return false;
    }
  }, {
    key: "getAll",
    value: function getAll(req, res) {
      var query = 'SELECT * FROM users';
      console.log(req.adminStatus);

      if (req.adminStatus) {
        _models["default"].query(query).then(function (result) {
          if (result.rowCount === 0) {
            res.status(404).json({
              status: 404,
              message: 'No Users Found'
            });
          } else if (result.rowCount >= 1) {
            res.json({
              status: 200,
              rows: result.rowCount,
              data: result.rows
            });
          }
        })["catch"](function (error) {
          res.status(500).json({
            status: 500,
            message: 'An error occurred when trying to get users from database',
            error: error
          });
        });
      } else {
        res.status(403).json({
          Message: 'Only Admins can access this route'
        });
      }
    }
  }, {
    key: "getOne",
    value: function getOne(req, res) {
      var id = req.params.id;

      if (req.adminStatus) {
        var query = "SELECT * FROM users WHERE id='".concat(id, "'");

        _models["default"].query(query).then(function (result) {
          if (result.rowCount === 0) {
            res.status(204).json({
              status: 204,
              message: 'No Such User Found'
            });
          } else if (result.rowCount >= 1) {
            res.json({
              status: 200,
              data: result.rows
            });
          }
        })["catch"](function (error) {
          res.status(500).json({
            status: 500,
            'An error occurred when trying to get user from database': error
          });
        });
      } else {
        res.status(403).json({
          status: 403,
          message: 'This is an admin functionality'
        });
      }
    }
  }, {
    key: "getUserParcels",
    value: function getUserParcels(req, res) {
      var id = req.params.id;

      if (req.adminStatus) {
        var query = "SELECT * FROM parcels WHERE senderId='".concat(id, "'");

        _models["default"].query(query).then(function (result) {
          if (result.rowCount === 0) {
            res.status(400).json({
              status: 400,
              message: 'User has no parcel delivery orders'
            });
          } else if (result.rowCount >= 1) {
            res.status(200).json({
              status: 200,
              rows: result.rowCount,
              data: result.rows
            });
          }
        })["catch"](function (error) {
          res.status(500).json({
            status: 500,
            'An error occurred when trying to get user parcels from database': error
          });
        });
      } else {
        res.status(403).json({
          Message: 'Only Admins can access this route'
        });
      }
    }
  }, {
    key: "makeAdmin",
    value: function makeAdmin(req, res) {
      if (req.adminStatus) {
        var id = req.params.id;
        var adminstatus = true;
        var query = "UPDATE users SET isAdmin='".concat(adminstatus, "' WHERE id='").concat(id, "' RETURNING *");

        _models["default"].query(query).then(function (result) {
          if (result.rowCount === 0) {
            res.status(204).json({
              status: 204,
              error: 'No such User'
            });
          }

          if (result.rowCount >= 1) {
            res.status(200).json({
              status: 200,
              Message: 'The user has been made an Admin successfully '
            });
          }
        })["catch"](function (error) {
          res.status(500).json({
            status: 500,
            'An error occurred while trying to make user an Admin, try again': error
          });
        });
      } else {
        res.status(403).json({
          Message: 'Only Admins can access this route'
        });
      }
    }
  }]);
  return User;
}();

var _default = User;
exports["default"] = _default;
//# sourceMappingURL=UsersController.js.map