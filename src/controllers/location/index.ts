import { Response } from 'express';
import { getConnection, getManager } from 'typeorm';
import LocationType from '../../models/LocationType';
import Location from '../../models/Location';
import { FORBIDDEN, SERVER_ERROR } from '../../shared/constants';
import { validateCreateLocation, validateEditLocation } from './validate';
import { UserRole } from '../../models/User/types';
import { sendError } from '../../shared/methods';
import { MyRequest } from '../../shared/types';

const create = async (req: MyRequest, res: Response) => {
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
    const { user } = req;

    if (user.role !== UserRole.ADMIN) {
      res.status(403).json(sendError(FORBIDDEN));
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
      location.typeId = typeId;
      const saved = await manager.save(location);
      res.json({
        ok: true,
        result: {
          id: saved.id,
          title: saved.title,
          coordinates: saved.coordinates,
          type: foundLocationType,
        },
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const getLocations = async (req: MyRequest, res: Response) => {
  try {
    const locations = await getConnection()
      .getTreeRepository(Location)
      .findTrees();
    res.json({ ok: true, result: locations });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, error: SERVER_ERROR });
  }
};

const deleteLocation = async (req: MyRequest, res: Response) => {
  const { user } = req;
  if (user.role !== UserRole.ADMIN) {
    res.status(403).json(sendError(FORBIDDEN));
    return;
  }
  try {
    const id = parseInt(req.params.id, 10);
    await getManager().transaction(async (manager) => {
      const found = await manager.findOne(Location, {
        where: {
          id,
        },
        relations: ['parent'],
      });
      if (!found) {
        res.status(404).json(sendError('Location not found!'));
        return;
      }
      console.log(found);
      const parent = await manager.findOne(Location, {
        where: {
          parent: found,
        },
      });
      if (parent) {
        res.json(sendError('Cannot delete location as there are references on this location!'));
        return;
      }
      await manager.delete(Location, id);
      if (found.parent) {
        res.json({
          ok: true,
          parentId: found.parent.id,
        });
      } else {
        res.json({
          ok: true,
        });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError('Cannot delete location!'));
  }
};

const edit = async (req: MyRequest, res: Response) => {
  try {
    const {
      title,
      coordinates,
      typeId,
    } = req.body;
    if (req.user.role !== UserRole.ADMIN) {
      res.status(403).json(sendError(FORBIDDEN));
      return;
    }
    if (!validateEditLocation(req, res)) {
      return;
    }
    await getManager()
      .transaction(async (manager) => {
        const location = await manager.findOne(Location, {
          where: {
            id: parseInt(req.params.id, 10),
          },
        });
        if (!location) {
          res.json(sendError('Location not found!'));
          return;
        }
        if (typeof typeId !== 'undefined') {
          const locationType = await manager.findOne(LocationType, {
            where: {
              id: typeId,
            },
          });
          if (!locationType) {
            res.json(sendError('Location type not found!'));
            return;
          }
        }
        location.title = title || location.title;
        location.coordinates = coordinates || location.coordinates;
        location.typeId = typeId || location.typeId;
        const result = await manager.save(location);
        res.json({ ok: true, result });
      });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const locationController = {
  create,
  get: getLocations,
  deleteLocation,
  edit,
};

export default locationController;
