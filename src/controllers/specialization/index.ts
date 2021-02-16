import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import Specialization from '../../models/Specialization';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateCreateSpecialization } from './validate';
import { UserRole } from '../../models/User/types';

const create = async (req: Request, res: Response) => {
  try {
    if (!validateCreateSpecialization(req, res)) {
      return;
    }
    const { user } = req as any;
    const {
      title,
      icon,
    } = req.body;
    const connection = getConnection();
    const specializations = connection.getRepository(Specialization);
    if (user.role !== UserRole.ADMIN) {
      res.json(sendError('Only admin can create specialization!'));
      return;
    }
    const found = await specializations.findOne({
      where: {
        title,
      },
    });
    if (found) {
      res.json(sendError(`Specialization with title='${title}' exists!`));
      return;
    }
    const spec = new Specialization();
    spec.title = title;
    spec.icon = icon;
    const result = await specializations.save(spec);
    res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const specializationController = {
  create,
};

export default specializationController;
