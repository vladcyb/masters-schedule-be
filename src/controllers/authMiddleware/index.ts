import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import User from '../../models/User';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { SECRET } = process.env;
  try {
    const auth = req.headers.authorization;
    const token = auth && auth.split(' ')[1];
    if (!token) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
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
      if (!user || user.token !== token) {
        res.json(sendError('Unauthorized'));
        return;
      }
    } catch (e) {
      res.json(sendError(SERVER_ERROR));
      return;
    }
    (req as any).user = {
      id,
    };
    next();
  } catch (e) {
    res.status(401).json(sendError('Unauthorized'));
  }
};

export default authMiddleware;
