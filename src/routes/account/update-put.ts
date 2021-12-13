import {Request, Response} from 'express';
import AccountController from '../../controllers/account';

export const swagger = {
  summary: 'Register a new user',
  tags: ['account'],
  responses: {
    '201': {
      description: 'Returns access token and renew token',
    },
    '400': {
      description: 'Bad request',
    },
  },
};

export const handler = async (req: Request, res: Response) => {
  const controller = new AccountController();
  controller.update(req, res);
};
