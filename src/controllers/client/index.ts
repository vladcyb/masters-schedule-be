import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import Order from '../../models/Order';
import { UserRole } from '../../models/User/types';
import { sendError } from '../../shared/sendError';
import { FORBIDDEN, SERVER_ERROR } from '../../shared/constants';

const getOrders = async (req: Request, res: Response) => {
  const { user } = (req as any);
  if (user.role !== UserRole.CLIENT) {
    res.status(403).json(sendError(FORBIDDEN));
    return;
  }
  try {
    const allOrders = getConnection().getRepository(Order);
    const orders = await allOrders.find({
      where: {
        client: user,
      },
    });
    res.json({ ok: true, result: orders });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const clientController = {
  getOrders,
};

export default clientController;
