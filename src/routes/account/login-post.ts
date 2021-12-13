import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';
import {PasswordPattern} from '@common/pattern';

import AccountController from '@controllers/account';

export enum ACCOUNT_LOGIN_STATUS {
  SUCCESS,
  USERNAME_NOT_FOUND,
  PASSWORD_INCORRECT,
}

export const schema: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PasswordPattern).required(),
});

export const swagger = {
  summary: 'Авторизация пользователя',
  description: 'Обработка запросов авторизации пользователя',
  tags: ['account'],
  responses: {
    '200': {
      description: 'Returns access token and renew token',
    },
    '401': {
      description: 'Password is incorrect',
    },
    '406': {
      description: 'User with the specified username was not found',
    },
  },
};

export const handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const controller = new AccountController();
  const status = await controller.login(req, res);
  switch (status) {
    case ACCOUNT_LOGIN_STATUS.SUCCESS:
      res.statusCode = 200;
      break;
    case ACCOUNT_LOGIN_STATUS.USERNAME_NOT_FOUND:
      res.statusCode = 406;
      break;
    case ACCOUNT_LOGIN_STATUS.PASSWORD_INCORRECT:
      res.statusCode = 401;
      break;
  }
  next();
};
