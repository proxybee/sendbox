import express from 'express';
import Auth from '../middleware/auth';
import DBUsers from '../controllers/UsersController';

const router = express.Router();
router.use(express.json());

router.get('/', Auth.verifyToken, DBUsers.getAll);
router.get('/:id', Auth.verifyToken, DBUsers.getOne);
router.get('/:id/parcels', Auth.verifyToken, DBUsers.getUserParcels);
router.post('/:id/makeadmin', Auth.verifyToken, DBUsers.makeAdmin);

export default router;
