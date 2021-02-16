import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import LocationType from '../../models/LocationType';
import Location from '../../models/Location';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateCreateLocation } from './validateCreateLocation';
import User from '../../models/User';
import { UserRole } from '../../models/User/types';

const create = async (req: Request, res: Response) => {
  try {
    if (!validateCreateLocation(req, res)) {
      return;
    }
    const {
      parentId,
      title,
      coordinates,
      typeId,
    } = req.body;
    const {
      user: { id: userId },
    } = req as any;
    const connection = getConnection();
    const locationsTypes = connection.getRepository(LocationType);
    const locations = connection.getRepository(Location);
    const users = connection.getRepository(User);

    const user = await users.findOne({
      where: {
        id: userId,
      },
    });
    if (user.role !== UserRole.ADMIN) {
      res.send(sendError('Only admin can create location!'));
      return;
    }

    // Проверка на существование типа указанной локации
    const foundLocationType = await locationsTypes.findOne({
      where: {
        id: typeId,
      },
    });
    if (!foundLocationType) {
      res.json(sendError('Location type not found!'));
      return;
    }
    const location = new Location();
    location.coordinates = coordinates;
    location.parent = parentId;
    location.title = title;
    location.type = typeId;
    const result = await locations.save(location);
    res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    res.json(sendError(SERVER_ERROR));
  }
};

const locationController = {
  create,
};

export default locationController;