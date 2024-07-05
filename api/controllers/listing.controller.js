import { StatusCodes } from 'http-status-codes';
import Listing from '~/models/listing.model';
import ApiError from '~/utils/ApiError';
import catchAsync from '~/utils/catchAsync';

export const createListing = catchAsync(async (req, res, next) => {
  const newListing = await Listing.create(req.body);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: newListing,
  });
});

export const deleteListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'No listing found'));
  }
  if (req.user.id !== listing.userRef) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Not authorized'));
  }
  await Listing.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Listing deleted successfully',
  });
});

export const updateListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'No listing found'));
  }
  if (req.user.id !== listing.userRef) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Not authorized'));
  }
  const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedListing,
  });
});
