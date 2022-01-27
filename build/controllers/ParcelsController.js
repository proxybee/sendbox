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

var _index = _interopRequireDefault(require("../models/index"));

var _updateNotification = _interopRequireDefault(require("../helpers/updateNotification"));

var _validator = require("../helpers/validator");

_dotenv["default"].config();

var tDate = new Date();
var updatedDate = (0, _moment["default"])(tDate).format('MM/DD/YYYY, HH:MM');

var Parcels = /*#__PURE__*/function () {
  function Parcels() {
    (0, _classCallCheck2["default"])(this, Parcels);
  }

  (0, _createClass2["default"])(Parcels, null, [{
    key: "create",
    value: function create(req, res) {
      var newOrder = {
        id: (0, _uuid.v4)(),
        senderId: req.user,
        weight: req.body.weight,
        weightMetric: 'kg',
        status: 'pending',
        fromAddress: req.body.fromAddress,
        toAddress: req.body.toAddress,
        currentLocation: req.body.fromAddress,
        itemName: req.body.itemName,
        recipient: req.body.recipient,
        postDate: (0, _moment["default"])(tDate).format('MM/DD/YYYY, HH:MM')
      };
      console.log(new Date());
      var fieldError = (0, _validator.createParcelsSchema)(newOrder);

      if (fieldError) {
        return res.status(400).json({
          status: res.statusCode,
          message: fieldError
        });
      }

      console.log(newOrder);
      var createQuery = "INSERT INTO parcels (id,senderId,weight,weightMetric,status,fromAddress,toAddress,currentLocation,itemName,recipient,postDate) \n                  VALUES('".concat(newOrder.id, "','").concat(newOrder.senderId, "','").concat(newOrder.weight, "','").concat(newOrder.weightMetric, "','").concat(newOrder.status, "','").concat(newOrder.fromAddress, "'\n                  ,'").concat(newOrder.toAddress, "','").concat(newOrder.currentLocation, "','").concat(newOrder.itemName, "','").concat(newOrder.recipient, "','").concat(newOrder.postDate, "') returning *");

      _index["default"].query(createQuery).then(function (result) {
        var Msg;

        if (result.rowCount === 0) {
          Msg = res.status(500).json({
            status: res.statusCode,
            Message: 'An error occurred while trying to save your order ensure that weight is a valid number and Address are not empty'
          });
        } else if (result.rowCount >= 1) {
          Msg = res.status(201).json({
            status: res.statusCode,
            message: 'New parcel added successfully',
            data: result.rows[0],
            rows: result.rowCount
          });
        }

        return Msg;
      })["catch"](function (error) {
        res.status(500).json({
          status: res.statusCode,
          error: "An error occurred while trying to save your order ".concat(error)
        });
      });

      return false;
    }
  }, {
    key: "getAll",
    value: function getAll(req, res) {
      if (!req.adminStatus) {
        var query = "SELECT * FROM parcels where placedBy ='".concat(req.user, "'");

        _index["default"].query(query).then(function (result) {
          var Msg;

          if (result.rowCount === 0) {
            Msg = res.status(204).json({
              status: res.statusCode,
              error: 'You have not created any parcels'
            });
          }

          if (result.rowCount >= 1) {
            Msg = res.status(200).json({
              status: res.statusCode,
              rows: result.rowCount,
              data: result.rows
            });
          }

          return Msg;
        })["catch"](function (error) {
          res.status(500).json({
            status: res.statusCode,
            'Could not get parcels from database': error
          });
        });
      } else {
        var _query = 'SELECT * FROM parcels';

        _index["default"].query(_query).then(function (result) {
          var Msg;

          if (result.rowCount === 0) {
            Msg = res.status(204).json({
              status: res.statusCode,
              error: 'No Parcels'
            });
          }

          if (result.rowCount >= 1) {
            Msg = res.status(200).json({
              status: res.statusCode,
              data: result.rows
            });
          }

          return Msg;
        })["catch"](function (error) {
          res.status(500).json({
            status: res.statusCode,
            'Could not get parcels from database': error
          });
        });
      }
    }
  }, {
    key: "getOne",
    value: function getOne(req, res) {
      var id = req.params.id;

      if (!req.adminStatus) {
        var query = "SELECT * FROM parcels WHERE id='".concat(id, "' AND placedBy='").concat(req.user, "'");

        _index["default"].query(query).then(function (result) {
          var Msg;

          if (result.rowCount === 0) {
            Msg = res.status(400).json({
              status: res.statusCode,
              error: 'You do not own such parcel delivery order'
            });
          }

          if (result.rowCount >= 1) {
            res.status(200).json({
              status: res.statusCode,
              data: result.rows[0]
            });
          }

          return Msg;
        })["catch"](function (error) {
          res.status(500).json({
            status: res.statusCode,
            'Could not get parcels from database': error
          });
        });
      } else {
        var _query2 = "SELECT * FROM parcels WHERE ID='".concat(id, "'");

        _index["default"].query(_query2).then(function (result) {
          var Msg;

          if (result.rowCount === 0) {
            Msg = res.status(204).json({
              status: res.statusCode,
              error: 'No such parcel'
            });
          }

          if (result.rowCount >= 1) {
            res.status(200).json({
              status: res.statusCode,
              data: result.rows[0]
            });
          }

          return Msg;
        })["catch"](function (error) {
          res.status(500).json({
            status: res.statusCode,
            'Internal server error, please try again later': error
          });
        });
      }
    }
  }, {
    key: "cancel",
    value: function cancel(req, res) {
      var id = req.params.id;
      var newStatus = 'canceled';
      var query = "UPDATE parcels SET status='".concat(newStatus, "',updatedDate='").concat(updatedDate, "' WHERE id='").concat(id, "' AND senderId='").concat(req.user, "' AND status NOT IN ('delivered','canceled') returning *");

      _index["default"].query(query).then(function (result) {
        var Msg;

        if (result.rowCount === 0) {
          Msg = res.status(400).json({
            status: 400,
            error: 'Ensure you are the owner of the parcel, and it not yet delivered or canceled'
          });
        }

        if (result.rowCount >= 1) {
          Msg = res.status(200).json({
            status: 200,
            message: 'Your parcel delivery order has been canceled ',
            data: result.rows[0]
          });
        }

        return Msg;
      })["catch"](function (error) {
        return res.status(500).json({
          status: 500,
          'Internal server error, please try again later': error
        });
      });
    }
  }, {
    key: "changeDestination",
    value: function changeDestination(req, res) {
      var id = req.params.id;
      var editedBy = req.user;
      var fieldError = (0, _validator.destinationSchema)(req.body);

      if (fieldError) {
        return res.status(400).json({
          status: 400,
          error: fieldError
        });
      }

      var newDestination = req.body.toAddress;
      var query = "UPDATE parcels SET toAddress='".concat(newDestination, "',updatedDate='").concat(updatedDate, "' WHERE id='").concat(id, "' AND senderId='").concat(editedBy, "' AND status NOT IN ('delivered','canceled') returning *");

      _index["default"].query(query).then(function (result) {
        var Msg;

        if (result.rowCount === 0) {
          Msg = res.status(400).json({
            status: 400,
            Message: 'Bad request, ensure that you own the parcel and it is not yet delivered or canceled'
          });
        }

        if (result.rowCount >= 1) {
          Msg = res.status(200).json({
            status: 200,
            Message: 'The destination has been changed successfully '
          });
        }

        return Msg;
      })["catch"](function (error) {
        return res.status(500).json({
          status: 500,
          'An error ocurred while trying to change the parcel Destination, try again': error
        });
      });

      return false;
    }
  }, {
    key: "changeCurrentLocation",
    value: function changeCurrentLocation(req, res) {
      if (req.adminStatus) {
        var id = req.params.id;
        var fieldError = (0, _validator.currentLocationSchema)(req.body);

        if (fieldError) {
          return res.status(400).json({
            status: 400,
            error: fieldError
          });
        }

        var currentLocation = req.body.currentLocation;
        var query = "UPDATE parcels SET currentLocation='".concat(currentLocation, "',updatedDate='").concat(updatedDate, "' WHERE id='").concat(id, "' AND (status != 'canceled' AND status != 'canceled') returning *");

        _index["default"].query(query).then(function (result) {
          var Msg;

          if (result.rowCount === 0) {
            Msg = res.status(400).json({
              status: 400,
              error: 'No such parcel'
            });
          }

          if (result.rowCount >= 1) {
            res.status(200).json({
              status: 200,
              Message: 'The current location of the order has been updated successfully '
            });
          }

          return Msg;
        })["catch"](function (error) {
          res.status(500).json({
            status: 500,
            'Internal server error, please try again later': error
          });
        });
      } else {
        res.json({
          Message: 'Only Admins can access this route'
        });
      }

      return false;
    }
  }, {
    key: "changeStatus",
    value: function changeStatus(req, res) {
      if (req.adminStatus) {
        var id = req.params.id;
        var fieldError = (0, _validator.changeStatusSchema)(req.body);

        if (fieldError) {
          return res.status(400).json({
            status: res.statusCode,
            error: fieldError
          });
        }

        var status = req.body.status;
        var query = "UPDATE parcels SET status='".concat(status, "',updatedDate='").concat(updatedDate, "' WHERE id='").concat(id, "' AND status NOT IN ('delivered','canceled')");

        _index["default"].query(query).then(function (result) {
          var Msg;

          if (result.rowCount === 0) {
            Msg = res.status(400).json({
              status: 400,
              error: 'Could not find the parcel in database'
            });
          }

          if (result.rowCount >= 1) {
            (0, _updateNotification["default"])(req.email);
            res.status(200).json({
              status: 200,
              Message: 'The status of the parcel has been changed successfully '
            });
          }

          return Msg;
        })["catch"](function (error) {
          res.status(500).json({
            status: 500,
            'Internal server error, please try again later': error
          });
        });
      } else {
        res.json({
          Message: 'Only Admins can access this route'
        });
      }

      return false;
    }
  }]);
  return Parcels;
}();

var _default = Parcels;
exports["default"] = _default;
//# sourceMappingURL=ParcelsController.js.map