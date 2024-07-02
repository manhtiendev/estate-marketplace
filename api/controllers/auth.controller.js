import { StatusCodes } from 'http-status-codes';
import User from '~/models/user.model';
import ApiError from '~/utils/ApiError';
import catchAsync from '~/utils/catchAsync';
import jwt from 'jsonwebtoken';
import { env } from '~/config/environment';
import bcryptjs from 'bcryptjs';
import removeVietnameseTones from '~/utils/convertVie';

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

export const google = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const { password: pass, ...rest } = user._doc;
    res.cookie('access_token', token, { httpOnly: true }).status(StatusCodes.OK).json({
      status: 'success',
      user: rest,
    });
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 12);
    const newUser = await User.create({
      username: removeVietnameseTones(
        req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(9).slice(-4)
      ),
      email: req.body.email,
      password: hashedPassword,
      passwordConfirmation: hashedPassword,
      avatar: req.body.photo,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const { password: pass, ...rest } = newUser._doc;
    res.cookie('access_token', token, { httpOnly: true }).status(StatusCodes.OK).json({
      status: 'success',
      user: rest,
    });
  }
});
