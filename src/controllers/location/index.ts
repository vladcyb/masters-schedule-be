import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import LocationType from '../../models/LocationType';
import Location from '../../models/Location';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateCreateLocation } from './validate';
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
    const { user } = req as any;
    const connection = getConnection();
    const locationsTypes = connection.getRepository(LocationType);
    const locations = connection.getRepository(Location);
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
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await getConnection()
      .getRepository(Location)
      .find();
    res.json({ ok: true, result: locations });
  } catch (e) {
    res.json({ ok: false, error: SERVER_ERROR });
  }
};

const locationController = {
  create,
  get: getLocations,
};

export default locationController;
