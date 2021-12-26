import {Request, Response, NextFunction} from 'express';
import * as Joi from 'joi';
import AccountController from '@controllers/account';
import {PasswordPattern} from '@common/pattern';
import {OperationObject} from '@/types/swagger';

export enum Status {
  SUCCESS,
  USERNAME_ALREADY_EXISTS,
  REPEAT_PASSWORD_ERROR,
  BAD_REQUEST,
}

export const requestBody: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PasswordPattern).required(),
  repeatPassword: Joi.string().pattern(PasswordPattern).required(),
});

export const swagger: OperationObject = {
  'summary': 'Регистрация пользователя',
  'description': 'Обработка запросов регистрации нового пользователя',
  'tags': ['account'],
  'responses': {
    '201': {
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
      description: 'Bad request',
    },
    '409': {
      description: 'User name already exists or the repeat password does not match the password',
    },
  },
};

export const handler = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
  const controller = new AccountController();
  const result = await controller.register(req, res);
  if (typeof result === 'object') {
    res.status(201);
    res.json({
      _id: result._id,
    });
  } else {
    switch (result) {
      case Status.BAD_REQUEST:
        res.status(400);
        break;
      case Status.USERNAME_ALREADY_EXISTS:
        res.status(409);
        res.json({
          message: 'Username already exists',
        });
        break;
      case Status.REPEAT_PASSWORD_ERROR:
        res.status(409);
        res.json({
          message: 'The repeat password does not match the password',
        });
        break;
    }
  }
  next();
};
