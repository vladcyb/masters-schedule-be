import { Response } from 'express';
import { sendError } from '../../shared/methods';
import { MyRequest } from '../../shared/types';

export const validateSetMasterSchedule = (req: MyRequest, res: Response): boolean => {
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

export const validateSetSpecializations = (req: MyRequest, res: Response): boolean => {
  const { specializations } = req.body;
  if (!specializations) {
    res.json(sendError('Enter `specializations`!'));
    return false;
  }
  if (!(specializations instanceof Array)) {
    res.json(sendError('`specializations` must be array!'));
    return false;
  }
  return true;
};
