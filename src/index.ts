import express from 'express';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import User from './entity/User';

createConnection().then(async (connection) => {
  const userRepository = connection.getRepository(User);
  const app = express();

  app.get('/test', async (req, res) => {
    const users = await userRepository.find();
    res.json(users);
  });

  app.listen(8000, () => console.log('listening...'));
}).catch((error) => console.log(error));
