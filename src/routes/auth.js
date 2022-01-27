import express from 'express';
import dotenv from 'dotenv';
import UserController from '../controllers/UsersController';

dotenv.config();

const router = express.Router();
router.use(express.json());

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

export default router;
