import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';
import {PasswordPattern} from '@common/pattern';

import AccountController from '@controllers/account';

export enum AccountLoginStatus {
  SUCCESS,
  USERNAME_NOT_FOUND,
  PASSWORD_INCORRECT,
  BAD_REQUEST
}

export const requestBody: Joi.ObjectSchema = Joi.object({
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
  }
};

export const handler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const controller = new AccountController()
  const status = await controller.login(req, res)
  switch (status) {
    case AccountLoginStatus.SUCCESS:
      res.status(200);
      break;
    case AccountLoginStatus.BAD_REQUEST:
      res.status(400);
      res.send('Bad request')
      break;
    case AccountLoginStatus.USERNAME_NOT_FOUND:
      res.status(406);
      res.send('No such user found')
      break;
    case AccountLoginStatus.PASSWORD_INCORRECT:
      res.status(401);
      res.send('Invalid password')
      break;
  }
  next();
};
