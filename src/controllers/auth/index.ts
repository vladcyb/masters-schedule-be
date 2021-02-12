import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { getConnection } from 'typeorm';
import { validateRegister } from './validateRegistration';
import User from '../../models/User';
import { sendError } from '../../shared/sendError';
import { SERVER_ERROR } from '../../shared/constants';
import { validateLogin } from './validateLogin';

const secretKey = fs.readFileSync('./src/private/secret');

const registerController = async (req: Request, res: Response) => {
  try {
    const users = getConnection()
      .getRepository(User);
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
    } = req.body;
    const foundUser = await users.findOne({
      where: {
        login,
      },
    });

    if (foundUser) {
      res.json(sendError('`login` is already taken!'));
      return;
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
    const token = jwt.sign({ id: user.id }, secretKey, {
      expiresIn: '1h',
    });
    res.json({ ok: true, token });
  } catch (e) {
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
