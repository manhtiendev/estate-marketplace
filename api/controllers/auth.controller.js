import User from '~/models/user.model';
import catchAsync from '~/utils/catchAsync';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    message: 'success',
    data: newUser,
  });
});
