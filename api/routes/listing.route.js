import express from 'express';
import { verifyToken } from '~/controllers/auth.controller';
import { createListing } from '~/controllers/listing.controller';

const router = express.Router();

router.route('/').post(verifyToken, createListing);

export default router;
