import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';
import { OrderStatus } from '../../models/Order/enums';

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

export const validateSetOrderStatus = (req: Request, res: Response): boolean => {
  const { id, status } = req.body;
  if (typeof id === 'undefined') {
    res.json(sendError('Enter order `id`!'));
    return false;
  }
  if (typeof id !== 'number') {
    res.json(sendError('`id` must be of type number!'));
    return false;
  }
  if (typeof status === 'undefined') {
    res.json(sendError('Enter order `status`!'));
    return false;
  }
  if (typeof status !== 'number') {
    res.json(sendError('Order `status` must be of type number!'));
    return false;
  }
  if (!(status in OrderStatus)) {
    res.json(sendError(`${status} is not valid status`));
    return false;
  }
  return true;
};
