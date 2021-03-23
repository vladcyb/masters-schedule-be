import { Request, Response } from 'express';
import { getConnection, getManager } from 'typeorm';
import Master from '../../models/Master';
import Schedule from '../../models/Schedule';
import { UserRole } from '../../models/User/types';
import { FORBIDDEN, SERVER_ERROR, UNAUTHORIZED } from '../../shared/constants';
import { validateSetMasterSchedule } from './validate';
import { sendError } from '../../shared/methods';

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
          res.status(401).json(sendError(UNAUTHORIZED));
          return;
        }
        // Проверка прав доступа
        if (user.role !== UserRole.MASTER) {
          res.status(403).json(sendError(FORBIDDEN));
          return;
        }
        // Валидация
        if (!validateSetMasterSchedule(req, res)) {
          return;
        }
        const transactionResult = await manager.save(Schedule, {
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

const getSchedule = async (req: Request, res: Response) => {
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

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await getConnection()
      .getRepository(Master)
      .find({
        relations: ['user'],
      });
    res.json({
      ok: true,
      result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const masterController = {
  setSchedule,
  getSchedule,
  getAll,
};

export default masterController;
