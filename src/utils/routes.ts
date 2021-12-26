import * as express from 'express';
import * as path from 'path';
import j2s from 'joi-to-swagger';
import {getFiles} from '@utils/files';
import {parentPort} from 'worker_threads';

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
      const pattern = new RegExp(`^.*-${method}.ts$`, 'gi');
      const files = await getFiles(routesDir, {
        pattern,
        absolutePath: true,
      });
      files.forEach((file: string) => {
        const filePath = '/api/' + file.slice(routesDir.length, file.lastIndexOf('-'));
        const url = String(filePath).replace(/path.sep/g, '/');
        console.log(url);
        resultFiles.push({
          method,
          url,
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
      result.forEach((file: File) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
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

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router[file.method](file.url, handler);

        const debug = process.env.DEBUG_ROUTE || false;
        if (debug) {
          console.log(`[${file.method.toUpperCase()}] route registered on: ${file.url}`);
        }
      });

      server.use(router);
      resolve(swData);
    });
  });
}
