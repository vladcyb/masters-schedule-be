import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { createConnection } from 'typeorm';
import routes from './routes';
import { initializeLocationTypes } from './models/LocationType/initialize';

createConnection()
  .then(async () => {
    await initializeLocationTypes();
    const app = express();

    // cross-origin
    app.use(cors());

    // session middleware settings
    const sess = {
      secret: 'keyboard cat',
      cookie: { secure: false },
      resave: false,
      saveUninitialized: true,
    };
    if (app.get('env') === 'production') {
      app.set('trust proxy', 1); // trust first proxy
      sess.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sess));

    app.use(express.json());
    app.use(routes);

    app.listen(8000, () => console.log('listening...'));
  })
  .catch((error) => console.log(error));
