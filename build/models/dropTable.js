"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("./index"));

var queryText = " DROP TABLE IF EXISTS parcels;\n                    DROP TABLE IF EXISTS users;";

_index["default"].query(queryText).then(function () {
  console.log('tables dropped');
})["catch"](function (err) {
  console.log(err, 'error occurred while dropping tables', _index["default"]); // db.end();
});