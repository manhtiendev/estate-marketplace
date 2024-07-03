import express from 'express';
import mongoose from 'mongoose';
import userRouter from '~/routes/user.route';
import authRouter from '~/routes/auth.route';
import listingRouter from '~/routes/listing.route';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { env } from './config/environment';
import cookieParser from 'cookie-parser';
import ApiError from '~/utils/ApiError';

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => console.log(err));

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/v1/users', userRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/listing', listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    status: 'fail',
    statusCode,
    message,
  });
});

app.use('*', (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.listen(env.APP_PORT, () => {
  console.log(`Server is running on port ${env.APP_PORT}`);
});
