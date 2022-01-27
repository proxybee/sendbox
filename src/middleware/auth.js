import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// import db from '../models';

dotenv.config();

class Auth {
  static verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization || req.query.token;
    if (typeof bearerHeader !== 'undefined') {
      req.token = bearerHeader;
      jwt.verify(req.token, process.env.JWT_SECRET, (err, data) => {
        console.log('auth data', data);
        if (err) {
          res.status(403).send('You are not authorized to access this page');
        } else {
          req.user = data.username;
          req.email = data.email;
          req.adminStatus = data.isAdmin;
          next();
        }
      });
    } else {
      res.status(403).json({ status: 403, message: 'Forbidden' });
    }
  }
}

export default Auth;
