"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _emailConfig = _interopRequireDefault(require("./emailConfig"));

var sendUpdateEmail = function sendUpdateEmail(email) {
  console.log('email update', email);
  var mailOptions = {
    to: email,
    from: "Sendbox ".concat(process.env.SENDER_EMAIL),
    subject: 'Parcel Delivery Order Update',
    generateTextFromHTML: true,
    html: "<div className=\"email\" style=\"\n        padding: 20px;\n        font-family: sans-serif;\n        line-height: 1.5;\n        font-size: 16px;\n      \">\n      <h3>Hello Customer, </h3>\n        Your parcel delivery order has been updated\n        <br>\n        <br>\n        Thank you\n        <br>\n        <br>\n        <div>Sendbox Team<div>\n      </div>"
  };

  _emailConfig["default"].sendMail(mailOptions, function (error, info) {
    console.log('email uodate ', error, info);

    if (error || info === 'undefined') {
      return {
        'error sending update': error
      };
    }

    return {
      message: info.response
    };
  });
};

var _default = sendUpdateEmail;
exports["default"] = _default;