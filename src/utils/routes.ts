import * as express from 'express'
import path from 'path'
import j2s from 'joi-to-swagger'
import { getFiles } from '@utils/files'

const HttpMethods = ['get', 'post', 'put', 'patch', 'delete'];

const routesDir = path.join(__dirname, '../routes/');

const router = express.Router();

const getFile = (file: string): string => file.replace(routesDir, '../routes/');

export default function registerRoutes(server: express.Express) {
  const swData: any = {};

  HttpMethods.forEach(async (method: string) => {
    const pattern = new RegExp(`^.*-${method}\.ts$`, 'gi')
    const files = await getFiles(routesDir, {
      pattern,
      absolutePath: false
    })

    files.forEach((file: string) => {
      const url = `/api/${file.substr(0, file.length - method.length - 4)}`

      const {swagger, handler, requestBody} = require(getFile(`${routesDir}/${file}`));

      swData[url] = {};
      swData[url][method] = swagger

      if(requestBody) {
        try {
          swData[url][method].requestBody = {
            name: "query",
            in: "query",
            content: {
              "application/json": {
                schema: j2s(requestBody).swagger
              }
            }
          }
        } catch(e) {
          console.log(e)
        }
      }

      const debug = process.env.DEBUG_ROUTE || false;
      if (debug) {
        console.log(`[${method.toUpperCase()}] route registered on: ${url}`);
      }
      // @ts-ignore
      router[method](url, handler);
    });
  });

  server.use(router);
  return swData;
}
