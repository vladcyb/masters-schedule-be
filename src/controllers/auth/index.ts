import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import User from '../../models/User';
import Master from '../../models/Master';
import Schedule from '../../models/Schedule';
import Location from '../../models/Location';
import Specialization from '../../models/Specialization';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateRegister, validateLogin } from './validate';
import { UserRole } from '../../models/User/types';
import { MasterStatus } from '../../models/Order/enums';

dotenv.config();
const { SECRET } = process.env;

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
        // Проверка на существование пользователя с таким логином
        const foundUser = await manager.findOne(User, {
          where: {
            login,
          },
        });
        if (foundUser) {
          res.json(sendError({
            login: 'Login is already taken!',
          }));
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
        user.role = role;
        user.login = login;
        user.password = passwordHash;
        user.surname = surname;
        user.name = name;
        user.patronymic = patronymic;
        await manager.save(user);
        const token = jwt.sign({ id: user.id }, SECRET, {
          expiresIn: '1h',
        });
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
        res
          .cookie('token', token)
          .json({
            ok: true,
            result: {
              id: user.id,
              login: user.login,
              surname: user.surname,
              name: user.name,
              patronymic: user.patronymic,
              role: user.role,
            },
          });
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
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
          res.send(sendError({
            login: 'User not found',
          }));
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          token = jwt.sign({ id: user.id }, SECRET, {
            expiresIn: '1h',
          });
          await manager.save(User, {
            ...user,
            token,
          });
          res
            .cookie('token', token)
            .json({
              ok: true,
              result: {
                id: user.id,
                login: user.login,
                surname: user.surname,
                name: user.name,
                patronymic: user.patronymic,
                role: user.role,
              },
            });
          return;
        }
        res.json(sendError({
          password: 'Incorrect password!',
        }));
      });
  } catch (e) {
    console.log(e);
    res.status(500).json(sendError(SERVER_ERROR));
  }
};

const AuthController = {
  register: registerController,
  login: loginController,
};

export default AuthController;
