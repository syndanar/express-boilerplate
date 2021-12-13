import 'module-alias/register';
import './plugins/dotenv';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as Joi from 'joi';
import {createRoutes} from 'express-joi-routes';
import * as swaggerUI from 'swagger-ui-express';
import swDocument from './../swagger.def';

const server: express.Express = express();
server.use(bodyParser.json());

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SERVER_MODE = process.env.SERVER_MODE || 'prod';

import registerRoutes from './utils/routes';
swDocument.paths = registerRoutes(server);
if (SERVER_MODE === 'dev') {
  server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swDocument));
}

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
