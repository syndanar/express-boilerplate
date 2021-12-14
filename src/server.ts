import 'module-alias/register';
import './plugins/dotenv';
import express from 'express';
import mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as Joi from 'joi';
import {createRoutes} from 'express-joi-routes';
import * as swaggerUI from 'swagger-ui-express';
import swDocument from './../swagger.def';

const server: express.Express = express();
server.use(bodyParser.json());

const url = 'mongodb://localhost:27017/default'

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER_MODE = process.env.SERVER_MODE || 'prod';

import registerRoutes from './utils/routes';
swDocument.paths = registerRoutes(server);
if (SERVER_MODE === 'dev') {
  server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument));
}

const mongooseOptions: mongoose.ConnectOptions = {}

mongoose.connect(url, mongooseOptions)
  .then(result => {
    server
      .listen(SERVER_PORT)
      .on('listening', () => {
        console.log(`Server listening on port ${SERVER_PORT}`);
      })
      .on('error', err => {
        console.log(err);
      })
      .on('close', () => {
        console.log('Server closed');
      });
  })
  .catch(err => console.log(err))

