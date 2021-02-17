import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { sendError } from '../../shared/sendError';
import Master from '../../models/Master';
import Schedule from '../../models/Schedule';
import { UserRole } from '../../models/User/types';
import { SERVER_ERROR } from '../../shared/constants';
import { validateSetMasterSchedule } from './validate';

const setSchedule = async (req: Request, res: Response) => {
  let result;
  try {
    result = await getManager()
      .transaction(async (manager) => {
        const hours = req.body.hours.replace(/\s/g, '');
        const { user } = req as any;
        const master = await manager.findOne(Master, {
          where: { user },
        });
        const schedule = await manager.findOne(Schedule, {
          where: { master },
        });
        if (!user) {
          res.status(401).json(sendError('Unauthorized'));
          return;
        }
        // Проверка прав доступа
        if (user.role !== UserRole.MASTER) {
          res.status(403).json(sendError('Access denied!'));
          return;
        }
        // Валидация
        if (!validateSetMasterSchedule(req, res)) {
          return;
        }
        const transactionResult = await manager.save(Schedule, { // TODO
          ...schedule,
          hours,
        });
        // eslint-disable-next-line consistent-return
        return transactionResult;
      });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: SERVER_ERROR,
    });
    return;
  }
  res.json({
    ok: true,
    result,
  });
};

const masterController = {
  setSchedule,
};

export default masterController;
