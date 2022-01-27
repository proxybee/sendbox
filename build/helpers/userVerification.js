"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _emailConfig = _interopRequireDefault(require("./emailConfig"));

var postUserVerification = function postUserVerification(req, res) {
  console.log('in verification', req.user);
  var token = 1;
  var mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: req.email,
    subject: 'Account Verification Token!',
    generateTextFromHTML: true,
    html: "<div className=\"email\" style=\"\n        border: 1px solid black;\n        padding: 20px;\n        font-family: sans-serif;\n        line-height: 2;\n        font-size: 20px;\n      \">\n        <h3>Hello ".concat(req.user, ", </h3>\n        <br>\n        <p>Thank you for registering on sendbox, to activate and enable you use your account, please verify your email by clicking the following link:https://").concat(req.headers.host, "/confirmation/").concat(token.token, "</p>\n        \n\n Thank you \n        <br>\n        <p>Sendbox Team</p>\n          ")
  };

  _emailConfig["default"].sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.json({
        error: true
      });
    }

    return res.json({
      done: true,
      message: info.response
    });
  });
};

var _default = postUserVerification;
exports["default"] = _default;
//# sourceMappingURL=userVerification.js.map