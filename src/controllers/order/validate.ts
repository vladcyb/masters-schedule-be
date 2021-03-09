import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';
import { OrderStatus } from '../../models/Order/enums';

export const validateCreateOrder = (req: Request, res: Response): boolean => {
  const {
    description,
    address,
    services,
  } = req.body;
  const { file: photo } = req;
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
    res.json(sendError('Upload photo!'));
    return false;
  }
  if (typeof services !== 'undefined' && typeof services !== 'string') {
    res.json(sendError('`services` must be of type string!'));
    return false;
  }
  return true;
};

export const validateSetOrderStatus = (req: Request, res: Response): boolean => {
  const { status } = req.body;
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
