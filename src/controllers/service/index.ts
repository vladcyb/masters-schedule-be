import { Response } from 'express';
import { getConnection, getManager } from 'typeorm';
import Specialization from '../../models/Specialization';
import Service from '../../models/Service';
import { SERVER_ERROR } from '../../shared/constants';
import { validateCreateService } from '../../routes/service/validate';
import { UserRole } from '../../models/User/types';
import { sendError } from '../../shared/methods';
import { MyRequest } from '../../shared/types';

const create = async (req: MyRequest, res: Response) => {
  try {
    if (!validateCreateService(req, res)) {
      return;
    }
    const {
      title,
      price,
      duration,
      specializationId,
    } = req.body;
    const { user } = req;
    if (user.role !== UserRole.ADMIN) {
      res.json(sendError('Only admin may create services!'));
      return;
    }
    await getManager().transaction(async (manager) => {
      const specialization = await manager.findOne(Specialization, {
        where: {
          id: specializationId,
        },
      });
      if (!specialization) {
        res.json(sendError(`Specialization with id=${specializationId} not found!`));
        return;
      }
      const service = new Service();
      service.title = title;
      service.duration = duration;
      service.price = price;
      service.specialization = specializationId;
      const saved = await manager.save(service);
      const result = await manager.findOne(Service, {
        where: {
          id: saved.id,
        },
        relations: ['specialization'],
      });
      res.json({ ok: true, result });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const getAll = async (req: MyRequest, res: Response) => {
  try {
    const result = await getConnection().getRepository(Service).find({
      relations: ['specialization'],
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

const serviceController = {
  create,
  getAll,
};

export default serviceController;
