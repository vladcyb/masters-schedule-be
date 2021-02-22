import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { TypeormStore } from 'typeorm-store';
import { createConnection, getConnection } from 'typeorm';
import routes from './routes';
import Session from './models/Session';
import { initializeLocationTypes } from './models/LocationType/initialize';

createConnection().then(async () => {
  /* environment variables */
  const {
    SECRET,
    COOKIE_MAX_AGE,
    NODE_ENV,
  } = process.env;

  /* creating locations */
  await initializeLocationTypes();

  const app = express();

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

  app.use(express.json());

  /* session middleware setup */
  const repository = getConnection().getRepository(Session);
  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: SECRET,
    store: new TypeormStore({ repository }),
    cookie: {
      maxAge: parseInt(COOKIE_MAX_AGE, 10),
      secure: NODE_ENV === 'production',
      httpOnly: true,
    },
  }));

  /* routing */
  app.use(routes);

  app.listen(8000, () => console.log('listening...'));
}).catch((error) => console.log(error));
