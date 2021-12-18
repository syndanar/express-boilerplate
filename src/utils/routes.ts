import * as express from 'express';
import * as path from 'path';
import j2s from 'joi-to-swagger';
import {getFiles} from '@utils/files';

const HttpMethods = ['get', 'post', 'put', 'patch', 'delete'];

const routesDir = path.join(__dirname, '../routes/');

// eslint-disable-next-line new-cap
const router = express.Router();

type File = {
  method: string,
  url: string,
  absolutePath: string
}

const files = (): Promise<File[]> => {
  return new Promise<File[]>((resolve) => {
    let completedMethods = 0;
    const resultFiles: File[] = [];
    HttpMethods.forEach(async (method: string) => {
      const pattern = new RegExp(`^.*-${method}\.ts$`, 'gi');
      const files = await getFiles(routesDir, {
        pattern,
        absolutePath: true,
      });
      files.forEach((file: string) => {
        resultFiles.push({
          method,
          url: `/api/${file.substr(routesDir.length, file.length - routesDir.length - method.length - 4)}`,
          absolutePath: file,
        });
      });
      completedMethods += 1;
      if (completedMethods === HttpMethods.length) {
        resolve(resultFiles);
      }
    });
  });
};

/**
 * Find files in routes dir by mask
 * Register routers and generate swagger ui data
 * @param {e.Express} server
 * @return {Promise<any>}
 */
export default function registerRoutes(server: express.Express): Promise<any> {
  return new Promise((resolve) => {
    const swData: any = {};

    files().then((result) => {
      console.log(result);
      result.forEach((file: File) => {
        const {swagger, handler, requestBody} = require(file.absolutePath);
        swData[file.url] = {};
        swData[file.url][file.method] = swagger;

        if (requestBody) {
          try {
            swData[file.url][file.method].requestBody = {
              name: 'query',
              in: 'query',
              content: {
                'application/json': {
                  schema: j2s(requestBody).swagger,
                },
              },
            };
          } catch (e) {
            console.log(e);
          }
        }

        // @ts-ignore
        router[file.method](file.url, handler);

        const debug = process.env.DEBUG_ROUTE || false;
        if (debug) {
          console.log(`[${file.method.toUpperCase()}] route registered on: ${file.url}`);
        }
      });

      server.use(router);
      console.log('resolved');
      resolve(swData);
    });
  });
}
