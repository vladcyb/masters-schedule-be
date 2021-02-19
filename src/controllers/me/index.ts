import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { SERVER_ERROR } from '../../shared/constants';
import User from '../../models/User';

export const getMe = async (req: Request, res: Response) => {
  const { user } = req as any;
  try {
    const me = await getConnection()
      .getRepository(User)
      .findOne({
        where: {
          id: user.id,
        },
        select: [
          'id',
          'login',
          'surname',
          'name',
          'patronymic',
          'role',
        ],
      });
    if (!me) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
      return;
    }
    res.json({ ok: true, result: me });
  } catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, error: SERVER_ERROR });
  }
};

const meController = {
  get: getMe,
};

export default meController;
