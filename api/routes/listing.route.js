import express from 'express';
import { verifyToken } from '~/controllers/auth.controller';
import {
  createListing,
  deleteListing,
  getListing,
  updateListing,
} from '~/controllers/listing.controller';

const router = express.Router();

router.route('/').post(verifyToken, createListing);
router
  .route('/:id')
  .get(getListing)
  .delete(verifyToken, deleteListing)
  .patch(verifyToken, updateListing);

export default router;
