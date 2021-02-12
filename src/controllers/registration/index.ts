import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { validateRegister } from './validate';
import User from '../../models/User';
import { sendError } from '../../shared/sendError';

const register = async (req: Request, res: Response) => {
  try {
    const users = getConnection()
      .getRepository(User);
    if (!validateRegister(res, req)) {
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

    const user = new User();
    user.role = role;
    user.login = login;
    user.password = bcrypt.hashSync(password, salt);
    user.surname = surname;
    user.name = name;
    user.patronymic = patronymic;
    await users.save(user);
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: 'Server error' });
  }
};

const RegistrationController = {
  register,
};

export default RegistrationController;
