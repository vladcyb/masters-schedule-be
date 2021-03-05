import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import Schedule from '../../models/Schedule';
import Master from '../../models/Master';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { UserRole } from '../../models/User/types';

const getMySchedule = async (req: Request, res: Response) => {
  const { user } = req as any;
  try {
    if (user.role !== UserRole.MASTER) {
      res.status(403).json({
        ok: false,
        error: 'You are not a master.',
      });
      return;
    }
    await getManager()
      .transaction(async (manager) => {
        const master = await manager.findOne(Master, {
          where: {
            user,
          },
        });
        const schedule = await manager.findOne(Schedule, {
          where: {
            master,
          },
        });
        res.json({
          ok: true,
          result: schedule,
        });
      });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const scheduleController = {
  getMySchedule,
};

export default scheduleController;
