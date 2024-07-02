import 'dotenv/config';

export const env = {
  MONGO_URI: process.env.MONGO_URI,
  APP_PORT: process.env.APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
};
