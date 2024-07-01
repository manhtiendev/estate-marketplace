import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from '~/routes/user.route';
import authRouter from '~/routes/auth.route';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.use('/v1/users', userRouter);
app.use('/v1/auth', authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    status: 'fail',
    statusCode,
    message,
  });
});

app.use('*', (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
