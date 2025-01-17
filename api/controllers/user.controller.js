import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import catchAsync from '~/utils/catchAsync';
import bcryptjs from 'bcryptjs';
import User from '~/models/user.model';
import Listing from '~/models/listing.model';

export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  const { password: pass, ...rest } = user._doc;

  res.status(StatusCodes.OK).json({
    status: 'success',
    user: rest,
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'You can only update your own account'));
  if (req.body.password) {
    req.body.password = bcryptjs.hashSync(req.body.password, 12);
  }
  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      },
    },
    { new: true }
  );
  const { password: pass, ...rest } = updateUser;
  res.status(StatusCodes.OK).json({
    status: 'success',
    user: rest,
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'You can only delete your own account'));
  }
  await User.findByIdAndDelete(req.params.id);
  res.clearCookie('access_token');
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'User has been deleted',
  });
});

export const getUserListings = catchAsync(async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'You can only view your own listing'));
  }
  const listings = await Listing.find({ userRef: req.params.id });
  res.status(StatusCodes.OK).json({
    status: 'success',
    listings,
  });
});
