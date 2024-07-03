import express from 'express';
import { verifyToken } from '~/controllers/auth.controller';
import { updateUser } from '~/controllers/user.controller';

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);

export default router;
