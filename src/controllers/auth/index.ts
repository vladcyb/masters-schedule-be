import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import User from '../../models/User';
import Master from '../../models/Master';
import Schedule from '../../models/Schedule';
import Location from '../../models/Location';
import Specialization from '../../models/Specialization';
import { validateRegister } from './validateRegistration';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateLogin } from './validateLogin';
import { UserRole } from '../../models/User/types';
import { MasterStatus } from '../../models/Order/enums';

const secretKey = fs.readFileSync('./src/private/secret');

const registerController = async (req: Request, res: Response) => {
  const {
    role,
    login,
    password,
    surname,
    name,
    patronymic,
    locationId,
    specializationId,
  } = req.body;
  try {
    await getManager()
      .transaction(async (manager) => {
        if (!validateRegister(req, res)) {
          return;
        }
        // Проверка на существование пользователя с таким паролем
        const foundUser = await manager.findOne(User, {
          where: {
            login,
          },
        });
        if (foundUser) {
          res.json(sendError('`login` is already taken!'));
          return;
        }
        if (role === UserRole.MASTER) {
          // проверка на существование локации
          const foundLocation = await manager.findOne(Location, {
            where: {
              id: locationId,
            },
          });
          if (!foundLocation) {
            res.json(sendError('Location not found!'));
            return;
          }

          // проверка на существование специализации
          const foundSpecialization = await manager.findOne(Specialization, {
            where: {
              id: specializationId,
            },
          });
          if (!foundSpecialization) {
            res.json(sendError('Specialization not found!'));
            return;
          }
        }

        const salt = bcrypt.genSaltSync(12);
        const passwordHash = bcrypt.hashSync(password, salt);

        const user = new User();
        const token = jwt.sign({ id: user.id }, secretKey, {
          expiresIn: '1h',
        });
        user.role = role;
        user.login = login;
        user.password = passwordHash;
        user.surname = surname;
        user.name = name;
        user.patronymic = patronymic;
        user.token = token;
        await manager.save(user);
        if (role === UserRole.MASTER) {
          const master = new Master();
          master.user = user;
          master.specialization = specializationId;
          master.location = locationId;
          await manager.save(master);
          const schedule = new Schedule();
          schedule.status = MasterStatus.IDLE;
          schedule.master = master;
          schedule.hours = '';
          await manager.save(schedule);
        }
        res.json({ ok: true, token });
      });
  } catch (e) {
    console.log(e);
    res.json({
      ok: false,
      error: SERVER_ERROR,
    });
  }
};

const loginController = async (req: Request, res: Response) => {
  let token;
  try {
    await getManager()
      .transaction(async (manager) => {
        if (!validateLogin(req, res)) {
          return;
        }
        const {
          login,
          password,
        } = req.body;
        const user = await manager.findOne(User, {
          where: {
            login,
          },
        });
        if (!user) {
          res.send(sendError('User not found'));
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: '1h',
          });
          await manager.save(User, {
            ...user,
            token,
          });
          res.json({ ok: true, token });
          return;
        }
        res.json(sendError('Incorrect password!'));
      });
  } catch (e) {
    res.json(sendError(SERVER_ERROR));
  } finally {
    if (!res.finished) {
      res.json({
        ok: true,
        token,
      });
    }
  }
};

const AuthController = {
  register: registerController,
  login: loginController,
};

export default AuthController;
