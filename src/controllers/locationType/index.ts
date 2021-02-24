import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import LocationType from '../../models/LocationType';

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await getConnection()
      .getRepository(LocationType)
      .find();
    res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    res.json(sendError(SERVER_ERROR));
  }
};

const locationTypeController = {
  getAll,
};

export default locationTypeController;
