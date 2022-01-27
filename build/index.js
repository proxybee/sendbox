"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _debug = _interopRequireDefault(require("debug"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _morgan = _interopRequireDefault(require("morgan"));

var _helmet = _interopRequireDefault(require("helmet"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _parcels = _interopRequireDefault(require("./routes/parcels"));

var _users = _interopRequireDefault(require("./routes/users"));

var _auth = _interopRequireDefault(require("./routes/auth"));

// import bodyParser from 'body-parser'
// import swagger from 'swagger-ui-express';
// import swaggerDocument from '../swagger.js';
_dotenv["default"].config();

var app = (0, _express["default"])();
var debug = (0, _debug["default"])('index');
var port = process.env.Port;
app.use((0, _morgan["default"])('tiny'));
app.use(_express["default"].json()); // For JSON requests

app.use(_express["default"].urlencoded({
  extended: true
}));
app.use((0, _helmet["default"])());
app.use((0, _cookieParser["default"])());
app.use((0, _expressSession["default"])({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 60000
  },
  resave: false,
  // forces the session to be saved back to the store
  saveUninitialized: false // dont save unmodified

})); // app.use(bodyParser.urlencoded({ extended: false }))

app.use((0, _cors["default"])({
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.get('/', function (req, res) {
  return res.status(200).json({
    msg: 'Welcome to SendBox API.'
  });
}); // import routes

app.use('/api/v1/auth', _auth["default"]);
app.use('/api/v1/parcels', _parcels["default"]);
app.use('/api/v1/users', _users["default"]); // app.use('/docs', swagger.serve, swagger.setup(swaggerDocument));
// eslint-disable-next-line no-unused-vars
// app.get((err, req, res, next) => {
//   res.status(500).send('Something is broken! Fix it!!!');
// });

app.use(function (err, req, res, next) {
  debug(err.stack);
  res.status(500);
  res.render('There was an Error processing your request. Something"s broken! to Fix it!!! update your data and try again', {
    error: err
  });
  next();
});
app.listen(port, function () {
  debug("App running on port ".concat(port, "."));
}); // const server = app.listen(port, () => {
//   debug(`App running on port ${port}.`);
// });
// process.on('exit', () => server.close());
// process.on('SIGTERM', () => server.close());
// process.on('uncaughtException', () => server.close());
//# sourceMappingURL=index.js.map