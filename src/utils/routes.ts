import * as express from 'express';
import * as glob from 'glob';

const HttpMethods = ['get', 'post', 'put', 'patch', 'delete'];

const routesDir = 'src/routes/';

const router = express.Router();

const getFile = (file: string): string => file.replace(routesDir, '../routes/');

export default function registerRoutes(server: express.Express) {
  const paths: any = {};

  HttpMethods.forEach((method: string) => {
    const files = glob.sync(`${routesDir}**/*-${method}.ts`);

    files.forEach((file: string) => {
      const url =
        '/api/' +
        file.substr(
          routesDir.length,
          file.length - `-${method}`.length - '.ts'.length - routesDir.length
        );

      const {swagger, handler} = require(getFile(file));

      paths[url] = {};
      paths[url][method] = swagger;

      const debug = process.env.DEBUG_ROUTE || false;
      if (debug) {
        console.log(`[${method.toUpperCase()}] route registered on: ${url}`);
      }
      // @ts-ignore
      router[method](url, handler);
    });
  });

  server.use(router);
  return paths;
}
