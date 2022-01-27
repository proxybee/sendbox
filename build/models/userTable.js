"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _index = _interopRequireDefault(require("./index"));

var userQuery = "CREATE TABLE IF NOT EXISTS\n      users(\n        id UUID PRIMARY KEY,\n        firstName VARCHAR(128) NOT NULL,\n        lastName VARCHAR(128) NOT NULL,\n        otherNames VARCHAR(128),\n        email VARCHAR(128) UNIQUE NOT NULL,\n        username VARCHAR(128) UNIQUE NOT NULL,\n        password VARCHAR(128) NOT NULL,\n        registered DATE,\n        lastLogin DATE,\n        updatedDate DATE,\n        isVerified BOOLEAN,\n        isAdmin BOOLEAN\n      )";

(function () {
  _index["default"].query(userQuery).then(function () {
    console.log('users table created!');
  })["catch"](function (err) {
    console.log('An error occurred while creating users:', err);
  });
})();
//# sourceMappingURL=userTable.js.map