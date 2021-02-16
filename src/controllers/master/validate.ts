import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';

export const validateSetMasterSchedule = (req: Request, res: Response): boolean => {
  const { hours } = req.body;
  if (typeof hours === 'undefined') {
    res.json(sendError('Enter `hours`!'));
    return false;
  }
  if (typeof hours !== 'string') {
    res.json(sendError('`hours` must be of type string'));
    return false;
  }
  return true;
};
