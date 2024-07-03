import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import catchAsync from '~/utils/catchAsync';
import bcryptjs from 'bcryptjs';
import User from '~/models/user.model';

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
