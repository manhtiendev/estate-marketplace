import { StatusCodes } from 'http-status-codes';
import User from '~/models/user.model';
import ApiError from '~/utils/ApiError';
import catchAsync from '~/utils/catchAsync';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';
import bcryptjs from 'bcryptjs';

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    message: 'success',
    data: newUser,
  });
});

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await User.findOne({ email });
  if (!validUser) return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  const validPassword = bcryptjs.compareSync(password, validUser.password);
  if (!validPassword) return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Wrong credentials'));
  const token = jwt.sign({ id: validUser._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  const { password: pass, ...rest } = validUser._doc;
  res.cookie('access_token', token, { httpOnly: true }).status(StatusCodes.OK).json({
    status: 'success',
    user: rest,
  });
});
