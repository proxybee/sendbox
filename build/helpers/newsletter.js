"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _emailConfig = _interopRequireDefault(require("./emailConfig"));

var postNewsletter = function postNewsletter(req, res) {
  var mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL_TO,
    subject: "".concat(req.body.name, " Newsletter!"),
    generateTextFromHTML: true,
    html: "<div className=\"email\" style=\"\n        border: 1px solid black;\n        padding: 20px;\n        font-family: sans-serif;\n        line-height: 2;\n        font-size: 20px;\n      \">\n        <p>Hi ".concat(req.body.username, ", </p>\n          ").concat(req.body.title, "\n          ").concat(req.body.image, "\n          ").concat(req.body.message, "\n          ").concat(req.body.disclaimer, "\n          </div>\n          \n\n\n          <a href=\"").concat(process.env.FRONTEND_URL, "/unsubscribe?useToken=").concat(req.param.token, "\">Click Here to Unsubscribe</a>\n          ")
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

var _default = postNewsletter;
exports["default"] = _default;
//# sourceMappingURL=newsletter.js.map