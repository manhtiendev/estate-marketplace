import { StatusCodes } from 'http-status-codes';
import Listing from '~/models/listing.model';
import catchAsync from '~/utils/catchAsync';

export const createListing = catchAsync(async (req, res, next) => {
  const newListing = await Listing.create(req.body);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: newListing,
  });
});
