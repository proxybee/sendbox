"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUpSchema = exports.makeAdminSchema = exports.loginSchema = exports.destinationSchema = exports.currentLocationSchema = exports.createParcelsSchema = exports.changeStatusSchema = void 0;

var _helper = _interopRequireDefault(require("./helper"));

// import Joi from 'joi';
var strPresent = function strPresent(str) {
  return !!str && !!str.toString().trim();
};

var validate = function validate(schema) {
  // find any field that returns a false
  var errorField = Object.keys(schema).find(function (field) {
    return !schema[field];
  });

  if (errorField) {
    return "".concat(errorField, " is invalid");
  }

  return false;
};

var signUpSchema = function signUpSchema(params) {
  var schema = {
    firstName: strPresent(params.firstName),
    lastName: strPresent(params.lastName),
    otherNames: params.otherNames,
    email: _helper["default"].isValidEmail(params.email),
    username: strPresent(params.username),
    password: strPresent(params.password)
  };
  return validate(schema);
};

exports.signUpSchema = signUpSchema;

var loginSchema = function loginSchema(params) {
  var schema = {
    email: _helper["default"].isValidEmail(params.email),
    password: strPresent(params.password)
  };
  return validate(schema);
};

exports.loginSchema = loginSchema;

var createParcelsSchema = function createParcelsSchema(params) {
  var schema = {
    weight: strPresent(params.weight),
    fromAddress: strPresent(params.fromAddress),
    toAddress: strPresent(params.toAddress),
    currentLocation: strPresent(params.currentLocation),
    itemName: strPresent(params.itemName),
    recipient: strPresent(params.recipient)
  };
  return validate(schema);
};

exports.createParcelsSchema = createParcelsSchema;

var destinationSchema = function destinationSchema(params) {
  var schema = {
    toAddress: strPresent(params.toAddress) && params.toAddress.length > 2
  };
  return validate(schema);
};

exports.destinationSchema = destinationSchema;

var currentLocationSchema = function currentLocationSchema(params) {
  var schema = {
    currentLocation: strPresent(params.currentLocation) && params.currentLocation.length > 2
  };
  return validate(schema);
};

exports.currentLocationSchema = currentLocationSchema;

var changeStatusSchema = function changeStatusSchema(params) {
  var schema = {
    status: strPresent(params.status) // && (params.status !== 'delivered'),

  };
  return validate(schema);
};

exports.changeStatusSchema = changeStatusSchema;

var makeAdminSchema = function makeAdminSchema(params) {
  var schema = {
    isAdmin: strPresent(params.isAdmin)
  };
  return validate(schema);
};

exports.makeAdminSchema = makeAdminSchema;