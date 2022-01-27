"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = require("pg");

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var pool = new _pg.Pool({
  connectionString: process.env.DB_URL
});
pool.connect(function (err) {
  if (err) {
    console.log('could not connect to postgres:', err);
  }

  pool.query('SELECT NOW() AS "theTime"', function (error, result) {
    if (error) {
      console.log('error running query:', error);
    } else {
      console.log(result.rows[0].theTime);
    }
  }); // pool.end();
});
var _default = {
  query: function query(text, params) {
    return new Promise(function (resolve, reject) {
      pool.query(text, params).then(function (res) {
        resolve(res);
      })["catch"](function (err) {
        reject(err);
      });
    });
  }
};
exports["default"] = _default;
//# sourceMappingURL=index.js.map