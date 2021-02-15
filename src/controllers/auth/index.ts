import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import User from '../../models/User';
import Location from '../../models/Location';
import Specialization from '../../models/Specialization';
import { validateRegister } from './validateRegistration';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateLogin } from './validateLogin';
import { UserRole } from '../../models/User/types';
import Master from '../../models/Master';

const secretKey = fs.readFileSync('./src/private/secret');

const registerController = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    const users = connection.getRepository(User);
    const locations = connection.getRepository(Location);
    const specializations = connection.getRepository(Specialization);
    const masters = connection.getRepository(Master);
    if (!validateRegister(req, res)) {
      return;
    }
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
    // Проверка на существование пользователя с таким паролем
    const foundUser = await users.findOne({
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
      const foundLocation = await locations.findOne({
        where: {
          id: locationId,
        },
      });
      if (!foundLocation) {
        res.json(sendError('Location not found!'));
        return;
      }

      // проверка на существование специализации
      const foundSpecialization = await specializations.findOne({
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
    await users.save(user);
    if (role === UserRole.MASTER) {
      const master = new Master();
      master.user = user;
      master.specialization = specializationId;
      master.location = locationId;
      await masters.save(master);
    }
    const token = jwt.sign({ id: user.id }, secretKey, {
      expiresIn: '1h',
    });
    res.json({ ok: true, token });
  } catch (e) {
    console.log(e);
    res.json({ ok: false, error: SERVER_ERROR });
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    if (!validateLogin(req, res)) {
      return;
    }
    const {
      login,
      password,
    } = req.body;
    const users = getConnection()
      .getRepository(User);
    const foundUser = await users.findOne({
      where: {
        login,
      },
    });
    if (!foundUser) {
      res.send(sendError('User not found'));
      return;
    }
    if (bcrypt.compareSync(password, foundUser.password)) {
      const token = jwt.sign({ id: foundUser.id }, secretKey, {
        expiresIn: '1h',
      });
      res.json({ ok: true, token });
    }
    res.json(sendError('Incorrect password!'));
  } catch (e) {
    res.json(sendError(SERVER_ERROR));
  }
};

const AuthController = {
  register: registerController,
  login: loginController,
};

export default AuthController;
