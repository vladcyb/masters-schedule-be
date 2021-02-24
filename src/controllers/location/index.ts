import { Request, Response } from 'express';
import { getConnection, getManager } from 'typeorm';
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

    if (user.role !== UserRole.ADMIN) {
      res.send(sendError('Only admin can create location!'));
      return;
    }
    await getManager().transaction(async (manager) => {
      // Проверка на существование типа указанной локации
      const foundLocationType = await manager.findOne(LocationType, {
        where: {
          id: typeId,
        },
      });
      const foundParentLocation = await manager.findOne(Location, {
        where: {
          id: parentId,
        },
      });
      if (!foundLocationType) {
        res.json(sendError('Location type not found!'));
        return;
      }
      if (!foundParentLocation && parentId) {
        res.json(sendError('Parent location with given id not found!'));
        return;
      }
      const location = new Location();
      location.coordinates = coordinates;
      location.parent = parentId;
      location.title = title;
      location.type = typeId;
      const saved = await manager.save(location);
      res.json({
        ok: true,
        result: {
          title: saved.title,
          coordinates: saved.coordinates,
          type: foundLocationType,
          parent: foundParentLocation,
        },
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await getConnection()
      .getRepository(Location)
      .find({
        relations: ['type', 'parent'],
      });
    res.json({ ok: true, result: locations });
  } catch (e) {
    console.log(e);
    res.json({ ok: false, error: SERVER_ERROR });
  }
};

const locationController = {
  create,
  get: getLocations,
};

export default locationController;
