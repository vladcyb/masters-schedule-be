import { Request, Response } from 'express';
import { getConnection, getManager } from 'typeorm';
import Specialization from '../../models/Specialization';
import Service from '../../models/Service';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateCreateService } from '../../routes/service/validate';
import { UserRole } from '../../models/User/types';

const create = async (req: Request, res: Response) => {
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
    const { user } = req as any;
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
      const result = await manager.save(service);
      res.json({ ok: true, result });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await getConnection().getRepository(Service).find();
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
