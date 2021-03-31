import { Response } from 'express';
import { getConnection, getManager, getRepository } from 'typeorm';
import { addHours, parseISO } from 'date-fns';
import Order from '../../models/Order';
import Service from '../../models/Service';
import Master from '../../models/Master';
import { validateCreateOrder, validateSetOrderStatus } from './validate';
import { FORBIDDEN, SERVER_ERROR } from '../../shared/constants';
import { OrderStatus } from '../../models/Order/enums';
import { UserRole } from '../../models/User/types';
import { sendError, sendResult } from '../../shared/methods';
import { MyRequest } from '../../shared/types';

const createOrder = async (req: MyRequest, res: Response) => {
  try {
    if (!validateCreateOrder(req, res)) {
      return;
    }
    const {
      description,
      address,
      services,
    } = req.body;
    const {
      file: photo,
      user,
      role: {
        isClient,
      },
    } = req;
    if (!isClient) {
      res.json(sendError('Only client may create orders.'));
      return;
    }

    await getManager().transaction(async (manager) => {
      let serviceNotFound = false;
      const servicesToSave = [];
      let price = 0;
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
            price += foundService.price;
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
      order.price = price;
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
          price: order.price,
        },
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const setOrderStatus = async (req: MyRequest, res: Response) => {
  const { user, role: { isMaster, isClient } } = req;
  const orderId = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!validateSetOrderStatus(req, res)) {
    return;
  }
  try {
    const orders = getConnection().getRepository(Order);
    const order = await orders.findOne({
      where: {
        id: orderId,
      },
    });
    if (!order) {
      res.status(404).json({ ok: false, error: 'Order not found!' });
      return;
    }
    if (isClient && order.clientId !== user.id) {
      res.status(403).json({ ok: false, error: 'It\'s not your order!' });
      return;
    }
    if (isMaster) {
      const master = await getRepository(Master)
        .findOne({
          where: {
            user,
          },
        });
      if (order.master.id !== master.id) {
        res.status(403).json({ ok: false, error: 'It\'s not your order!' });
        return;
      }
    }
    order.status = status;
    await orders.save(order);
    res.json({ ok: true });
  } catch (e) {
    console.log(e);
    res.json(sendError(SERVER_ERROR));
  }
};

const getAll = async (req: MyRequest, res: Response) => {
  try {
    const {
      user,
      role: {
        isAdmin,
        isMaster,
        isOperator,
        isClient,
      },
    } = req;
    const connection = getConnection();
    const ordersRepository = connection.getRepository(Order);
    const mastersRepository = connection.getRepository(Master);
    if (isClient) {
      const result = await ordersRepository
        .createQueryBuilder('order')
        .where({
          client: user,
        })
        .leftJoinAndSelect('order.services', 'service')
        .leftJoinAndSelect('order.master', 'master')
        .orderBy('order.id')
        .getMany();
      res.json({
        ok: true,
        result,
      });
    } else if (isAdmin || isOperator) {
      const result = await ordersRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.services', 'service')
        .leftJoinAndSelect('order.master', 'master')
        .orderBy('order.id')
        .getMany();
      res.json({
        ok: true,
        result,
      });
    } else if (isMaster) {
      const master = await mastersRepository.findOne({
        where: {
          user,
        },
      });
      const result = await ordersRepository
        .createQueryBuilder('order')
        .where({
          master,
        })
        .leftJoinAndSelect('order.services', 'service')
        .leftJoinAndSelect('order.master', 'master')
        .orderBy('order.id')
        .getMany();
      res.json({
        ok: true,
        result,
      });
    } else {
      res.status(403).json(sendError(FORBIDDEN));
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const setStartDate = async (req: MyRequest, res: Response) => {
  try {
    const {
      user,
      body: { date },
      role: {
        isClient,
        isAdmin,
        isOperator,
      },
    } = req;
    const { id } = req.params;
    if (!(isOperator || isAdmin || isClient)) {
      res.status(403).json(sendError(FORBIDDEN));
      return;
    }
    const connection = getConnection();
    const ordersRepo = connection.getRepository(Order);

    const order = await ordersRepo.findOne({
      where: {
        id,
      },
      relations: ['services'],
    });
    let duration = 0;
    for (let i = 0; i < order.services.length; i += 1) {
      duration += order.services[i].duration;
    }
    order.startDate = date;
    order.finishDate = addHours(parseISO(date), duration).toISOString();
    await ordersRepo.save(order);
    res.json({
      ok: true,
      result: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const setServices = async (req: MyRequest, res: Response) => {
  try {
    const {
      user,
      body: { services },
    } = req;

    /* checking permissions */
    if (user.role !== UserRole.OPERATOR && user.role !== UserRole.ADMIN) {
      res.status(403).json(sendError(FORBIDDEN));
      return;
    }

    /* validation */
    if (!services) {
      res.json(sendError('Enter `services`!'));
      return;
    }
    await getManager().transaction(async (manager) => {
      const order = await manager
        .findOne(Order, {
          where: {
            id: parseInt(req.params.id, 10),
          },
          relations: ['services'],
        });
      const servicesToSave = await manager
        .createQueryBuilder(Service, 'service')
        .where('service.id IN (:...services)', {
          services,
        })
        .getMany();

      if (!order) {
        res.status(404).json(sendError('Заказ не найден!'));
        return;
      }
      order.services = servicesToSave;

      /* пересчет времени выполнения */
      const { startDate } = order;
      if (startDate) {
        let duration = 0;
        for (let i = 0; i < order.services.length; i += 1) {
          duration += order.services[i].duration;
        }
        order.finishDate = addHours(parseISO(startDate), duration)
          .toISOString();
      }

      /* пересчет стоимости заказа */
      let price = 0;
      for (let i = 0; i < servicesToSave.length; i += 1) {
        price += servicesToSave[i].price;
      }
      order.price = price;
      const result = await manager.save(order);
      res.json(sendResult(result));
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

export const setMaster = async (req: MyRequest, res: Response) => {
  try {
    const { id, masterId } = req.params;
    if (!id) {
      res.json(sendError('Enter order `id`!'));
      return;
    }
    if (!masterId) {
      res.json(sendError('Enter `masterId`!'));
      return;
    }
    const orders = getRepository(Order);
    const masters = getRepository(Master);
    const order = await orders
      .findOne({
        where: {
          id: parseInt(id, 10),
        },
      });
    if (!order) {
      res.json(sendError('Заказ не найден!'));
      return;
    }
    const master = await masters
      .findOne({
        where: {
          id: parseInt(masterId, 10),
        },
      });
    if (!master) {
      res.json(sendError('Мастер не найден!'));
      return;
    }
    order.master = master;
    await orders.save(order);
    res.json(sendResult(order));
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const deny = async (req: MyRequest, res: Response) => {
  const {
    role,
    params: {
      id,
    },
  } = req;
  try {
    if (!role.isOperator) {
      res.json(sendError(FORBIDDEN));
      return;
    }
    const orders = getRepository(Order);
    const order = await orders
      .findOne({
        where: {
          id,
        },
      });
    if (!order) {
      res.status(404).json(sendError(FORBIDDEN));
      return;
    }
    order.status = OrderStatus.DENIED;
    await orders.save(order);
    res.json({ ok: true });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const orderController = {
  createOrder,
  setOrderStatus,
  getAll,
  setStartDate,
  setServices,
  setMaster,

  /* действия, связанные со статусом заказа */
  deny,
};

export default orderController;
