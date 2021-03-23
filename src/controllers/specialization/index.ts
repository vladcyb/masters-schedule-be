import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import Specialization from '../../models/Specialization';
import { SERVER_ERROR } from '../../shared/constants';
import { validateCreateSpecialization, validateUpdateSpecialization } from './validate';
import { UserRole } from '../../models/User/types';
import { sendError } from '../../shared/methods';

const create = async (req: Request, res: Response) => {
  try {
    if (!validateCreateSpecialization(req, res)) {
      return;
    }
    const { user } = req as any;
    const {
      title,
    } = req.body;
    const { file: icon } = req;
    const connection = getConnection();
    const specializations = connection.getRepository(Specialization);
    if (user.role !== UserRole.ADMIN) {
      res.json(sendError('Only administrator can create specialization!'));
      return;
    }
    const found = await specializations.findOne({
      where: {
        title,
      },
    });
    if (found) {
      res.json(sendError({
        title: `Specialization with title='${title}' exists!`,
      }));
      return;
    }
    const spec = new Specialization();
    spec.title = title;
    spec.icon = icon.path;
    const result = await specializations.save(spec);
    res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const getSpecializations = async (req: Request, res: Response) => {
  try {
    const result = await getConnection()
      .getRepository(Specialization)
      .find();
    res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const update = async (req: Request, res: Response) => {
  if (!validateUpdateSpecialization(req, res)) {
    return;
  }
  const { user } = req as any;
  const {
    id, title, icon,
  } = req.body;
  try {
    if (user.role !== UserRole.ADMIN) {
      res.json(sendError('Only administrator can edit specialization!'));
      return;
    }
    const specializations = getConnection().getRepository(Specialization);
    const specialization = await specializations
      .findOne({
        where: {
          id,
        },
      });
    if (!specialization) {
      res.json({ ok: false, error: 'Specialization not found!' });
      return;
    }
    specialization.title = title;
    specialization.icon = icon;
    await specializations.save(specialization);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json(sendError(SERVER_ERROR));
    console.log(e);
  }
};

const specializationController = {
  create,
  get: getSpecializations,
  update,
};

export default specializationController;
