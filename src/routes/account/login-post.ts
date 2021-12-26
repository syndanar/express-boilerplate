import {NextFunction, Request, Response} from 'express';
import * as Joi from 'joi';
import {PasswordPattern} from '@common/pattern';

import AccountController from '@controllers/account';
import {OperationObject} from '@/types/swagger';
import * as jwt from 'jsonwebtoken';
import {JWT_OPTIONS, SECRET_KEY} from '@/config/jwt';

export enum Status {
  SUCCESS,
  USERNAME_NOT_FOUND,
  PASSWORD_INCORRECT,
  BAD_REQUEST
}

export const requestBody: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PasswordPattern).required(),
});

export const swagger: OperationObject = {
  'summary': 'Авторизация пользователя',
  'description': 'Обработка запросов авторизации пользователя',
  'tags': ['account'],
  'responses': {
    '200': {
      'description': 'Returns access token and renew token',
      'content': {
        'application/json': {
          'schema': {
            'type': 'object',
            'properties': {
              '_id': {
                type: 'string',
              },
            },
          },
        },
      },
    },
    '400': {
      'description': 'Bad request',
    },
    '401': {
      'description': 'Password is incorrect',
    },
    '406': {
      'description': 'User with the specified username was not found',
    },
  },
};

export const handler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
  const controller = new AccountController();
  const result = await controller.login(req, res);
  if (typeof result === 'object') {
    res.status(200);
    const payload = {
      _id: result._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, JWT_OPTIONS);
    res.send(token);
  } else {
    switch (result) {
      case Status.BAD_REQUEST:
        res.status(400);
        res.send('Bad request');
        break;
      case Status.USERNAME_NOT_FOUND:
        res.status(406);
        res.send('No such user found');
        break;
      case Status.PASSWORD_INCORRECT:
        res.status(401);
        res.send('Invalid password');
        break;
    }
  }
  next();
};
