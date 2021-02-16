import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import User from '../../models/User';
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
      user: {
        id: userId,
      },
    } = req as any;
    const {
      title,
      price,
      duration,
      specializationId,
    } = req.body;
    const connection = getConnection();
    const users = connection.getRepository(User);
    const services = connection.getRepository(Service);
    const user = await users.findOne({
      where: {
        id: userId,
      },
    });
    if (user.role !== UserRole.ADMIN) {
      res.json(sendError('Only admin may create services!'));
      return;
    }
    const service = new Service();
    service.title = title;
    service.duration = duration;
    service.price = price;
    service.specialization = specializationId;
    const result = await services.save(service);
    res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const serviceController = {
  create,
};

export default serviceController;
