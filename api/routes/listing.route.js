import express from 'express';
import { verifyToken } from '~/controllers/auth.controller';
import { createListing, deleteListing } from '~/controllers/listing.controller';

const router = express.Router();

router.route('/').post(verifyToken, createListing);
router.route('/:id').delete(verifyToken, deleteListing);

export default router;
