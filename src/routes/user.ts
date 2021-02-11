import { Router } from 'express';
import { getConnection } from 'typeorm';
import User from '../models/User';

const userRoutes = Router();

userRoutes.get('/', async (req, res) => {
  const result = await getConnection().getRepository(User).find();
  res.json(result);
});

export default userRoutes;
