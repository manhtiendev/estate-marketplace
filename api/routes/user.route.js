import express from 'express';
import { verifyToken } from '~/controllers/auth.controller';
import { deleteUser, updateUser } from '~/controllers/user.controller';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;
