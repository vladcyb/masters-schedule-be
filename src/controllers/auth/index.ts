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
import { SERVER_ERROR } from '../../shared/constants';
import { validateRegister, validateLogin } from './validate';
import { UserRole } from '../../models/User/types';
import { MasterStatus } from '../../models/Order/enums';
import { sendError } from '../../shared/methods';

dotenv.config();

const {
  SECRET, BCRYPT_ROUNDS, COOKIE_MAX_AGE, ALLOW_MANY_SESSIONS,
} = process.env;

const registerController = async (req: Request, res: Response) => {
  const {
    role,
    login,
    password,
    surname,
    name,
    patronymic,
    locationId,
    specializationIds,
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
          // const foundSpecialization = await manager.findOne(Specialization, {
          //   where: {
          //     id: specializationId,
          //   },
          // });
          // if (!foundSpecialization) {
          //   res.json(sendError('Specialization not found!'));
          //   return;
          // }
        }

        const salt = bcrypt.genSaltSync(parseInt(BCRYPT_ROUNDS, 10));
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
          expiresIn: COOKIE_MAX_AGE,
        });
        user.token = token;
        await manager.save(user);
        if (role === UserRole.MASTER) {
          const master = new Master();
          master.user = user;
          const specializationsToSave = await manager
            .createQueryBuilder(Specialization, 'specialization')
            .where('specialization.id IN (:...specializations)', {
              specializations: specializationIds,
            })
            .getMany();

          master.specializations = specializationsToSave;
          master.location = locationId;
          await manager.save(master);
          const schedule = new Schedule();
          schedule.status = MasterStatus.IDLE;
          schedule.master = master;
          schedule.hours = '';
          await manager.save(schedule);
        }
        (req.session as any).token = token;
        res
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
          res.json(sendError({
            login: 'User not found',
          }));
          return;
        }
        if (bcrypt.compareSync(password, user.password)) {
          token = jwt.sign({ id: user.id }, SECRET, {
            expiresIn: COOKIE_MAX_AGE,
          });
          await manager.save(User, {
            ...user,
            token,
          });
          (req.session as any).token = token;
          res
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

const logoutController = async (req: Request, res: Response) => {
  try {
    const { token } = req.session as any;
    if (!token) {
      res.json({ ok: true });
      return;
    }
    const payload = jwt.verify(token, SECRET);
    const { id } = payload as any;
    await getManager()
      .transaction(async (manager) => {
        const user = await manager.findOne(User, {
          where: {
            id,
          },
        });
        if (!user || (user.token !== token && ALLOW_MANY_SESSIONS === 'no')) {
          res.json({ ok: true });
          return;
        }
        user.token = null;
        await manager.save(user);
        req.session.destroy((err) => {
          if (err) {
            console.log(err);
            res.json({ ok: false, error: SERVER_ERROR });
            return;
          }
          res.json({ ok: true });
        });
      });
  } catch (e) {
    console.log(e);
    /* Если токен не валидный, то словится ошибка */
    res
      .json({ ok: true });
  }
};

const AuthController = {
  register: registerController,
  login: loginController,
  logout: logoutController,
};

export default AuthController;
