import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import User from '../../models/User';
import Schedule from '../../models/Schedule';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { UserRole } from '../../models/User/types';
import Master from '../../models/Master';

const setSchedule = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    const users = connection.getRepository(User);
    const masters = connection.getRepository(Master);
    const schedules = connection.getRepository(Schedule);
    const {
      hours,
    } = req.body;
    const {
      user: {
        id,
      },
    } = req as any;
    const user = await users.findOne({
      where: {
        id,
      },
    });
    const master = await masters.findOne({
      where: {
        user,
      },
    });
    const schedule = await schedules.findOne({
      where: {
        master,
      },
    });
    if (!user) {
      res.json({ ok: false, error: 'Unauthorized!' });
      return;
    }
    if (user.role !== UserRole.MASTER) {
      res.json(sendError('Access denied!'));
      return;
    }
    if (typeof hours === 'undefined') {
      res.json(sendError('Enter `hours`!'));
      return;
    }
    if (typeof hours !== 'string') {
      res.json(sendError('`hours` must be of type string'));
      return;
    }
    console.log(master);
    const result = await schedules.save({
      ...schedule,
      hours,
    });
    res.json({ ok: true, result });
  } catch (e) {
    res.json(sendError(SERVER_ERROR));
    console.log(e);
  }
};

const masterController = {
  setSchedule,
};

export default masterController;
