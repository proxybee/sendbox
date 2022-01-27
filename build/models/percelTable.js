"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("./index"));

var parcelQuery = "CREATE TABLE IF NOT EXISTS\n      parcels(\n        id UUID PRIMARY KEY,\n        weight FLOAT NOT NULL, \n        weightMetric VARCHAR NOT NULL,\n        sentOn TIMESTAMP,\n        deliveredOn DATE,\n        status VARCHAR NOT NULL,\n        fromAddress VARCHAR NOT NULL,\n        toAddress VARCHAR NOT NULL,\n        currentLocation VARCHAR,\n        itemName VARCHAR(120),\n        recipient VARCHAR(120),\n        postDate DATE,\n        updatedDate DATE,\n        senderId VARCHAR NOT NULL\n      )";
setTimeout(function () {
  _index["default"].query(parcelQuery).then(function () {
    console.log('parcels table created!');
  })["catch"](function (err) {
    console.log('An error occurred while creating parcels table: ', err);
  });
}, 100);
//# sourceMappingURL=percelTable.js.map