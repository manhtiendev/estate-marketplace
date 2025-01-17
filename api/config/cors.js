import { env } from '~/config/environment';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const WHITELIST_DOMAINS = ['http://localhost:5173'];

export const corsOptions = {
  origin: function (origin, callback) {
    // Xử lý gọi api tại postman vì origin postman trả về undefined
    if (!origin && env.BUILD_MODE === 'dev') {
      return callback(null, true);
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`)
    );
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  credentials: true,
};
