import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { validateCreateOrder } from './validateCreateOrder';
import User from '../../models/User';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import Order from '../../models/Order';
import { OrderStatus } from '../../models/Order/types';
import { UserRole } from '../../models/User/types';
import Service from '../../models/Service';

const createOrder = async (req: Request, res: Response) => {
  try {
    if (!validateCreateOrder(req, res)) {
      return;
    }
    const connection = getConnection();
    const users = connection.getRepository(User);
    const orders = connection.getRepository(Order);
    const services = connection.getRepository(Service);
    const {
      description,
      address,
      photo,
      service,
    } = req.body;
    const { id: clientId } = (req as any).user;
    const user = await users.findOne({
      where: {
        id: clientId,
      },
    });
    if (!user) {
      res.status(401).json(sendError('Unauthorized!'));
      return;
    }
    if (user.role !== UserRole.CLIENT) {
      res.json(sendError('Only client may create orders.'));
      return;
    }
    if (typeof service !== 'undefined') {
      const foundService = await services.findOne({
        where: {
          id: service,
        },
      });
      if (!foundService) {
        res.json(sendError(`Service with id=${service} not found!`));
        return;
      }
    }
    const order = new Order();
    order.address = address;
    order.description = description;
    order.photo = photo;
    order.client = clientId;
    order.status = OrderStatus.PENDING;
    order.service = service;
    await orders.save(order);
    res.json({ ok: true });
  } catch (e) {
    console.log(e);
    res.json(sendError(SERVER_ERROR));
  }
};

const orderController = {
  createOrder,
};

export default orderController;
