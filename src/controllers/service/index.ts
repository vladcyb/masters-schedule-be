import { Request, Response } from 'express';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateCreateService } from '../../routes/service/validate';

const create = async (req: Request, res: Response) => {
  try {
    if (!validateCreateService(req, res)) {
      return;
    }
    res.json({ ok: true });
  } catch (e) {
    console.log(e);
    res.json(sendError(SERVER_ERROR));
  }
};

const serviceController = {
  create,
};

export default serviceController;
