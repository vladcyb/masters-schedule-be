import { Request, Response } from 'express';
import { getConnection, getManager } from 'typeorm';
import Order from '../../models/Order';
import Service from '../../models/Service';
import { validateSetOrderStatus, validateCreateOrder } from './validate';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { OrderStatus } from '../../models/Order/enums';
import { UserRole } from '../../models/User/types';

const createOrder = async (req: Request, res: Response) => {
  try {
    if (!validateCreateOrder(req, res)) {
      return;
    }
    const {
      description,
      address,
      services,
    } = req.body;
    const { file: photo, user } = req as any;
    if (user.role !== UserRole.CLIENT) {
      res.json(sendError('Only client may create orders.'));
      return;
    }

    await getManager().transaction(async (manager) => {
      let serviceNotFound = false;
      const servicesToSave = [];
      if (typeof services !== 'undefined') {
        const serviceIds = JSON.parse(services);
        for (let i = 0; i < serviceIds.length; i += 1) {
          const serviceId = parseInt(serviceIds[i], 10);
          // eslint-disable-next-line no-await-in-loop
          const foundService = await manager.findOne(Service, {
            where: {
              id: serviceId,
            },
          });
          if (!foundService) {
            res.json(sendError(`Service with id=${serviceId} not found!`));
            serviceNotFound = true;
          } else {
            servicesToSave.push(foundService);
          }
        }
      }
      if (serviceNotFound) {
        return;
      }
      const order = new Order();
      order.address = address;
      order.description = description;
      order.photo = photo.path;
      order.client = user;
      order.status = OrderStatus.PENDING;
      order.services = servicesToSave;
      await manager.save(order);
      res.json({
        ok: true,
        result: {
          id: order.id,
          description: order.description,
          startDate: order.startDate,
          finishDate: order.finishDate,
          comment: order.comment,
          photo: order.photo,
          status: order.status,
          address: order.address,
          services: order.services,
        },
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const setOrderStatus = async (req: Request, res: Response) => {
  const { user } = req as any;
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!validateSetOrderStatus(req, res)) {
    return;
  }
  try {
    const orders = getConnection().getRepository(Order);
    const order = await orders.findOne({
      where: {
        id,
      },
    });
    if (!order) {
      res.status(404).json({ ok: false, error: 'Order not found!' });
      return;
    }
    if (order.clientId !== user.id) {
      res.status(403).json({ ok: false, error: 'It\'s not your order!' });
      return;
    }
    order.status = status;
    await orders.save(order);
    res.json({ ok: true, result: order });
  } catch (e) {
    console.log(e);
    res.json(sendError(SERVER_ERROR));
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;
    const result = await getConnection()
      .getRepository(Order)
      .find({
        where: {
          client: user,
        },
      });
    res.json({ ok: true, result });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const orderController = {
  createOrder,
  setOrderStatus,
  getAll,
};

export default orderController;
