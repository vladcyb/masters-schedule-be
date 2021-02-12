import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';

export const validateLogin = (req: Request, res: Response): boolean => {
  const {
    login,
    password,
  } = req.body;
  if (!login) {
    res.json(sendError('Enter `login`!'));
    return false;
  }
  if (typeof login !== 'string') {
    res.json(sendError('`login` must be of type string!'));
    return false;
  }
  if (!password) {
    res.json(sendError('Enter `password`!'));
    return false;
  }
  if (typeof password !== 'string') {
    res.json(sendError('`password` must be of type string!'));
    return false;
  }
  return true;
};
