import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';

export const validateCreateOrder = (req: Request, res: Response): boolean => {
  const {
    description,
    address,
    photo,
    service,
  } = req.body;
  if (!description) {
    res.json(sendError('Enter `description`!'));
    return false;
  }
  if (typeof description !== 'string') {
    res.json(sendError('`description` must be of type string!'));
    return false;
  }
  if (!address) {
    res.json(sendError('Enter `address`!'));
    return false;
  }
  if (typeof address !== 'string') {
    res.json(sendError('`address` must be of type string!'));
    return false;
  }
  if (!photo) {
    res.json(sendError('Enter `photo`!'));
    return false;
  }
  if (typeof photo !== 'string') {
    res.json(sendError('`photo` must be of type string!'));
    return false;
  }
  if (typeof service !== 'undefined' && typeof service !== 'number') {
    res.json(sendError('`service` must be of type number!'));
    return false;
  }
  return true;
};
