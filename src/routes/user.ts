import { Router } from 'express';

const userRoutes = Router();

userRoutes.get('/', (req, res) => {
  res.json({ foo: 'User route' });
});

export default userRoutes;
