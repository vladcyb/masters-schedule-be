import { Request, Response } from 'express';
import { sendError } from '../../shared/methods';

export const validateSetMasterSchedule = (req: Request, res: Response): boolean => {
  const hours = req.body.hours.replace(/\s/g, '');
  if (typeof hours === 'undefined') {
    res.json(sendError('Enter `hours`!'));
    return false;
  }
  if (typeof hours !== 'string') {
    res.json(sendError('`hours` must be of type string'));
    return false;
  }
  if (!(/^([([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).test(hours)) {
    res.json(sendError('`hours` must be in format `hh:mm-hh:mm`'));
    return false;
  }
  return true;
};
