import { StatusCodes } from 'http-status-codes';
import Listing from '~/models/listing.model';
import ApiError from '~/utils/ApiError';
import catchAsync from '~/utils/catchAsync';

export const getListings = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 8;
  const startIndex = parseInt(req.query.startIndex) || 0;
  const searchTerm = req.query.searchTerm || '';
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order || 'desc';

  let offer = req.query.offer;
  if (offer === undefined || offer === 'false') {
    offer = { $in: [false, true] };
  }

  let furnished = req.query.furnished;
  if (furnished === undefined || furnished === 'false') {
    furnished = { $in: [false, true] };
  }

  let parking = req.query.parking;
  if (parking === undefined || parking === 'false') {
    parking = { $in: [false, true] };
  }

  let type = req.query.type;
  if (type === undefined || type === 'all') {
    type = { $in: ['sale', 'rent'] };
  }

  const listings = await Listing.find({
    name: { $regex: searchTerm, $options: 'i' },
    offer,
    furnished,
    parking,
    type,
  })
    .sort({
      [sort]: order,
    })
    .limit(limit)
    .skip(startIndex);
  res.status(StatusCodes.OK).json({
    status: 'success',
    results: listings.length,
    data: listings,
  });
});

export const getListing = catchAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'No listing found'));
  }
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: listing,
  });
});

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
  });
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedListing,
  });
});
