import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(16));
  },
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },
  isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  },
  generateToken(payload) {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '3d' },
    );
    return token;
  },
};

export default Helper;
