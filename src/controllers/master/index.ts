import { Response } from 'express';
import { getConnection, getManager, getRepository } from 'typeorm';
import Master from '../../models/Master';
import Schedule from '../../models/Schedule';
import Specialization from '../../models/Specialization';
import { UserRole } from '../../models/User/types';
import { FORBIDDEN, SERVER_ERROR, UNAUTHORIZED } from '../../shared/constants';
import { validateSetMasterSchedule, validateSetSpecializations } from './validate';
import { sendError, sendResult } from '../../shared/methods';
import { MyRequest } from '../../shared/types';

const setSchedule = async (req: MyRequest, res: Response) => {
  let result;
  try {
    result = await getManager()
      .transaction(async (manager) => {
        const hours = req.body.hours.replace(/\s/g, '');
        const { user } = req;
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

const getSchedule = async (req: MyRequest, res: Response) => {
  const { user } = req;
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

const getAll = async (req: MyRequest, res: Response) => {
  try {
    const result = await getConnection()
      .getRepository(Master)
      .find({
        relations: ['user', 'location', 'specializations'],
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

export const setSpecializations = async (req: MyRequest, res: Response) => {
  try {
    if (!req.role.isResponsible) {
      res.json(FORBIDDEN);
      return;
    }
    if (!validateSetSpecializations(req, res)) {
      return;
    }
    const id = parseInt(req.params.id, 10);
    const { specializations } = req.body;

    await getManager().transaction(async (manager) => {
      const master = await manager.findOne(Master, {
        where: {
          id,
        },
      });

      if (!master) {
        res.status(404).json(sendError('Master not found!'));
        return;
      }

      /* Если переданный в запросе массив с ID специализаций пустой */
      if (!specializations.length) {
        master.specializations = [];
        await manager.save(master);
        res.json({
          ok: true,
          result: master,
        });
        return;
      }

      master.specializations = await manager
        .createQueryBuilder(Specialization, 'specialization')
        .where('specialization.id IN (:...specializations)', {
          specializations,
        })
        .getMany();
      await manager.save(master);
      res.json({
        ok: true,
        result: master,
      });
    });
  } catch (e) {
    console.log(e);
    res.json(sendError(SERVER_ERROR));
  }
};

const deleteSpecialization = async (req: MyRequest, res: Response) => {
  try {
    const { role } = req;
    if (!(role.isResponsible || role.isAdmin)) {
      res.status(403).json(sendError(FORBIDDEN));
      return;
    }
    const masterId = parseInt(req.params.id, 10);
    const specId = parseInt(req.params.specId, 10);
    const masters = getRepository(Master);
    const master = await masters.findOne({
      where: {
        id: masterId,
      },
      relations: ['specializations'],
    });
    if (!master) {
      res.status(404).json(sendError('Error: master not found!'));
      return;
    }
    const { specializations } = master;
    const index = specializations.findIndex((spec) => spec.id === specId);
    if (index === -1) {
      res.json(sendResult(specializations));
      return;
    }
    specializations.splice(index, 1);
    await masters.save(master);
    res.json(sendResult(specializations));
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const addSpecialization = async (req: MyRequest, res: Response) => {
  try {
    const masterId = parseInt(req.params.id, 10);
    const specializationId = parseInt(req.params.specId, 10);

    const masters = getRepository(Master);

    const master = await masters.findOne({
      where: {
        id: masterId,
      },
      relations: ['specializations'],
    });
    if (!master) {
      res.status(404).json(sendError('Master not found!'));
      return;
    }
    const specialization = await getRepository(Specialization).findOne({
      where: {
        id: specializationId,
      },
    });
    if (!specialization) {
      res.status(404).json(sendError('Specialization not found!'));
      return;
    }
    if (master.specializations.every((spec) => spec.id !== specializationId)) {
      master.specializations.push(specialization);
      await masters.save(master);
    }
    res.json(sendResult(specialization));
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const masterController = {
  setSchedule,
  getSchedule,
  getAll,
  setSpecializations,
  deleteSpecialization,
  addSpecialization,
};

export default masterController;
