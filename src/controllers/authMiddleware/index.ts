import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import User from '../../models/User';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR, UNAUTHORIZED } from '../../shared/constants';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { SECRET, ALLOW_MANY_SESSIONS } = process.env;
  try {
    const { token } = req.session as any;
    if (!token) {
      res.status(401).json(sendError(UNAUTHORIZED));
      return;
    }
    const payload = jwt.verify(token, SECRET);
    const { id } = payload as any;
    try {
      const user = await getConnection()
        .getRepository(User)
        .findOne({
          where: {
            id,
          },
        });
      if (!user || (ALLOW_MANY_SESSIONS === 'no' && user.token !== token)) {
        res.status(401).json(sendError(UNAUTHORIZED));
        return;
      }
      (req as any).user = user;
    } catch (e) {
      res.status(500).json(sendError(SERVER_ERROR));
      return;
    }
    next();
  } catch (e) {
    res.status(401).json(sendError(UNAUTHORIZED));
  }
};

export default authMiddleware;
