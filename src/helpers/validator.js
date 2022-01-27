// import Joi from 'joi';
import helper from './helper';

const strPresent = (str) => !!str && !!str.toString().trim();

const validate = (schema) => {
  // find any field that returns a false
  const errorField = Object.keys(schema).find((field) => !schema[field]);
  if (errorField) { return `${errorField} is invalid`; }
  return false;
};

const signUpSchema = (params) => {
  const schema = {
    firstName: strPresent(params.firstName),
    lastName: strPresent(params.lastName),
    otherNames: params.otherNames,
    email: helper.isValidEmail(params.email),
    username: strPresent(params.username),
    password: strPresent(params.password),
  };
  return validate(schema);
};

const loginSchema = (params) => {
  const schema = {
    email: helper.isValidEmail(params.email),
    password: strPresent(params.password),
  };
  return validate(schema);
};

const createParcelsSchema = (params) => {
  const schema = {
    weight: strPresent(params.weight),
    fromAddress: strPresent(params.fromAddress),
    toAddress: strPresent(params.toAddress),
    currentLocation: strPresent(params.currentLocation),
    itemName: strPresent(params.itemName),
    recipient: strPresent(params.recipient),
  };
  return validate(schema);
};

const destinationSchema = (params) => {
  const schema = {
    toAddress: strPresent(params.toAddress)
                    && params.toAddress.length > 2,
  };
  return validate(schema);
};

const currentLocationSchema = (params) => {
  const schema = {
    currentLocation: strPresent(params.currentLocation)
                          && params.currentLocation.length > 2,
  };
  return validate(schema);
};

const changeStatusSchema = (params) => {
  const schema = {
    status: strPresent(params.status),
    // && (params.status !== 'delivered'),
  };
  return validate(schema);
};

const makeAdminSchema = (params) => {
  const schema = {
    isAdmin: strPresent(params.isAdmin),
  };
  return validate(schema);
};

export {
  signUpSchema, loginSchema, createParcelsSchema, destinationSchema, currentLocationSchema,
  changeStatusSchema, makeAdminSchema,
};
