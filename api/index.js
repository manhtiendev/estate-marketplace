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

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
