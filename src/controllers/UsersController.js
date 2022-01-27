import dotenv from 'dotenv';
import moment from 'moment';
import { v4 as uuid4 } from 'uuid';
import db from '../models';
import Helper from '../helpers/helper';
import { signUpSchema, loginSchema } from '../helpers/validator';

dotenv.config();
const tDate = new Date();
class User {
  static signup(req, res) {
    if (
      !req.body.email
      || !req.body.password
      || req.body.password.length <= 4
    ) {
      return res.status(400).send({ message: 'Some values are missing' });
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send({ message: 'Please enter a valid email address' });
    }
    const hashedPassword = Helper.hashPassword(req.body.password);
    const newUser = {
      id: uuid4(),
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      otherNames: req.body.othernames,
      email: req.body.email,
      username: req.body.username,
      isVerified: 'false',
      isAdmin: 'false',
      password: hashedPassword,
      registered: moment(tDate).format('MM/DD/YYYY, HH:MM'),
    };
    const fieldError = signUpSchema(newUser);
    if (fieldError) {
      return res.status(500).send({ message: fieldError });
    }
    const userQuery = `INSERT INTO users (id,firstName,lastName,otherNames,email,username,isVerified,isAdmin,password,registered) 
                    VALUES('${newUser.id}','${newUser.firstName}','${newUser.lastName}','${newUser.otherNames}','${newUser.email}',
                    '${newUser.username}','${newUser.isVerified}','${newUser.isAdmin}','${newUser.password}','${newUser.registered}')`;
    db.query(userQuery)
      .then((result) => {
        if (result.rowCount >= 1) {
          res
            .status(200)
            .json({ status: 200, message: 'User saved successfully' });
        } else if (result.rowCount === 0) {
          res
            .status(500)
            .json({ status: 500, message: 'The user could not be saved' });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          'An error occurred while trying to save user': error.detail,
          table: error.table,
        });
      });
    return false;
  }

  static login(req, res) {
    if (loginSchema(req.body)) {
      return res
        .status(400)
        .send({ message: 'Either email or password is missing or incorrect' });
    }
    const loginData = {
      email: req.body.email,
      password: req.body.password,
      lastLogin: moment(tDate).format('MM/DD/YYYY, HH:MM'),
    };
    const query = `SELECT * FROM users WHERE email='${loginData.email}'`;
    db.query(query)
      .then((result) => {
        if (result.rowCount === 0) {
          res.status(400).json({
            status: 400,
            error:
              'An error occurred while trying to log you in Check your details again',
          });
        } else if (result.rowCount >= 1) {
          if (
            !Helper.comparePassword(result.rows[0].password, req.body.password)
          ) {
            res
              .status(400)
              .json({ message: 'The credentials you provided are incorrect' });
          }
          const tokenData = {
            id: result.rows[0].id,
            isAdmin: result.rows[0].isadmin,
            username: result.rows[0].username,
            email: result.rows[0].email,
          };
          delete loginData.password;
          const token = Helper.generateToken(tokenData);
          res.status(200).json({ token, message: 'Login successful' });
        }
      })
      .catch((error) => {
        console.log('The login error', error);
        res.status(500).json({
          status: 500,
          error:
            'This is an internal server error, try again later again',
        });
      });
    return false;
  }

  static getAll(req, res) {
    const query = 'SELECT * FROM users';
    console.log(req.adminStatus);
    if (req.adminStatus) {
      db.query(query)
        .then((result) => {
          if (result.rowCount === 0) {
            res.status(404).json({ status: 404, message: 'No Users Found' });
          } else if (result.rowCount >= 1) {
            res.json({ status: 200, rows: result.rowCount, data: result.rows });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status: 500,
            message: 'An error occurred when trying to get users from database',
            error,
          });
        });
    } else {
      res.status(403).json({ Message: 'Only Admins can access this route' });
    }
  }

  static getOne(req, res) {
    const { id } = req.params;
    if (req.adminStatus) {
      const query = `SELECT * FROM users WHERE id='${id}'`;
      db.query(query)
        .then((result) => {
          if (result.rowCount === 0) {
            res
              .status(204)
              .json({ status: 204, message: 'No Such User Found' });
          } else if (result.rowCount >= 1) {
            res.json({ status: 200, data: result.rows });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status: 500,
            'An error occurred when trying to get user from database': error,
          });
        });
    } else {
      res
        .status(403)
        .json({ status: 403, message: 'This is an admin functionality' });
    }
  }

  static getUserParcels(req, res) {
    const { id } = req.params;
    if (req.adminStatus) {
      const query = `SELECT * FROM parcels WHERE senderId='${id}'`;
      db.query(query)
        .then((result) => {
          if (result.rowCount === 0) {
            res.status(400).json({
              status: 400,
              message: 'User has no parcel delivery orders',
            });
          } else if (result.rowCount >= 1) {
            res.status(200).json({ status: 200, rows: result.rowCount, data: result.rows });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status: 500,
            'An error occurred when trying to get user parcels from database':
              error,
          });
        });
    } else {
      res.status(403).json({ Message: 'Only Admins can access this route' });
    }
  }

  static makeAdmin(req, res) {
    if (req.adminStatus) {
      const { id } = req.params;
      const adminstatus = true;
      const query = `UPDATE users SET isAdmin='${adminstatus}' WHERE id='${id}' RETURNING *`;
      db.query(query)
        .then((result) => {
          if (result.rowCount === 0) {
            res.status(204).json({ status: 204, error: 'No such User' });
          }
          if (result.rowCount >= 1) {
            res.status(200).json({
              status: 200,
              Message: 'The user has been made an Admin successfully ',
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status: 500,
            'An error occurred while trying to make user an Admin, try again':
              error,
          });
        });
    } else {
      res.status(403).json({ Message: 'Only Admins can access this route' });
    }
  }
}

export default User;
