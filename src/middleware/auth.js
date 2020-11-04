import { GetUserData } from '../config/axios';
import statusCode from '../constant/statusCode';

export async function AuthMiddleware(req, res, next) {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(statusCode.UN_AUTHORIZED).json({
      error: 'unauthorized',
    });
  }

  const user = await GetUserData(token);

  if (!user) {
    return res.status(statusCode.FORBIDDEN).json({
      error: 'forbidden',
    });
  }

  next();
}
