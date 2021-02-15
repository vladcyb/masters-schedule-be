import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';
import { UserRole } from '../../models/User/types';

export const validateRegister = (req: Request, res: Response): boolean => {
  const {
    role,
    login,
    password,
    surname,
    name,
    patronymic,
    locationId,
    specializationId,
  } = req.body;
  if (!role) {
    res.json(sendError('Enter `role`!'));
    return false;
  }
  if (!(role in UserRole)) {
    res.json(sendError('`role` must be `MASTER`, `CLIENT`, `OPERATOR`, `ADMIN` or `RESPONSIBLE`!'));
    return false;
  }
  if (!login) {
    res.json(sendError('Enter `login`!'));
    return false;
  }
  if (typeof login !== 'string') {
    res.json(sendError('`login` must be of type string!'));
    return false;
  }
  if (!login[0].match(/[a-zA-Z]/) || !login.match(/^[A-Za-z0-9]*$/)) {
    res.json(sendError('`login` must begin with a letter and contain only Latin letters and numbers!'));
    return false;
  }
  if (!password) {
    res.json(sendError('Enter `password`!'));
    return false;
  }
  if (typeof password !== 'string') {
    res.json(sendError('`login` must be of type string!'));
    return false;
  }
  if (password.length < 8) {
    res.json(sendError('`password` must contain at least 8 characters!'));
    return false;
  }
  if (!surname) {
    res.json(sendError('Enter `surname`!'));
    return false;
  }
  if (typeof surname !== 'string') {
    res.json(sendError('`surname` must be of type string!'));
    return false;
  }
  if (!name) {
    res.json(sendError('Enter `name`!'));
    return false;
  }
  if (typeof name !== 'string') {
    res.json(sendError('`name` must be of type string!'));
    return false;
  }
  if (typeof patronymic === 'undefined') {
    res.json(sendError('Enter `patronymic`!'));
    return false;
  }
  if (typeof patronymic !== 'string') {
    res.json(sendError('`patronymic` must be of type string!'));
    return false;
  }
  if (role === UserRole.MASTER) {
    if (!locationId) {
      res.json(sendError('Enter `locationId`!'));
      return false;
    }
    if (typeof locationId !== 'number') {
      res.json(sendError('`locationId` must be of type number!'));
      return false;
    }
    if (!specializationId) {
      res.json(sendError('Enter `specializationId`!'));
      return false;
    }
    if (typeof specializationId !== 'number') {
      res.json(sendError('`specializationId` must be of type number!'));
      return false;
    }
  }
  return true;
};
