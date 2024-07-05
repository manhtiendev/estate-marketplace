import express from 'express';
import { verifyToken } from '~/controllers/auth.controller';
import { deleteUser, getUserListings, updateUser } from '~/controllers/user.controller';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);

export default router;
