import {Request, Response, NextFunction} from 'express';
import AccountController from '../../controllers/account';

export const swagger = {
  summary: 'Create a new user',
  tags: ['account'],
  requestBody: {
    content: {
      'application/json': {
        schema: {},
      },
    },
  },
  responses: {
    '201': {
      description: 'Returns access token and renew token',
    },
    '400': {
      description: 'Bad request',
    },
  },
};

export const handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const controller = new AccountController();
  controller.register(req, res);
};
