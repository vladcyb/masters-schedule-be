import jwt from 'jsonwebtoken';
import { getConnection } from 'typeorm';
import { NextFunction, Response } from 'express';
import User from '../../models/User';
import { SERVER_ERROR, UNAUTHORIZED } from '../../shared/constants';
import { sendError } from '../../shared/methods';
import { UserRole } from '../../models/User/types';
import { MyRequest } from '../../shared/types';

const authMiddleware = async (req: MyRequest, res: Response, next: NextFunction) => {
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
      req.user = user;
      req.role = {
        isAdmin: user.role === UserRole.ADMIN,
        isMaster: user.role === UserRole.MASTER,
        isOperator: user.role === UserRole.OPERATOR,
        isClient: user.role === UserRole.CLIENT,
        isResponsible: user.role === UserRole.RESPONSIBLE,
      };
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
