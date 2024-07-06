import express from 'express';
import { verifyToken } from '~/controllers/auth.controller';
import {
  createListing,
  deleteListing,
  getListing,
  updateListing,
  getListings,
} from '~/controllers/listing.controller';

const router = express.Router();

router.route('/').post(verifyToken, createListing).get(getListings);
router
  .route('/:id')
  .get(getListing)
  .delete(verifyToken, deleteListing)
  .patch(verifyToken, updateListing);

export default router;
