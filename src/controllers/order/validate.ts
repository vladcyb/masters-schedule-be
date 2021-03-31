import { Request, Response } from 'express';
import { OrderStatus } from '../../models/Order/enums';
import { sendError } from '../../shared/methods';

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
