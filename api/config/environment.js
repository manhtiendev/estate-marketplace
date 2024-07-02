import 'dotenv/config';

export const env = {
  MONGO_URI: process.env.MONGO_URI,
  APP_PORT: process.env.APP_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  BUILD_MODE: process.env.BUILD_MODE,
};
