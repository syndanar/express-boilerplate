import {Request, Response, NextFunction} from 'express';
import * as Joi from 'joi';
import AccountController from '@controllers/account';
import {PasswordPattern} from '@common/pattern';

export enum AccountRegisterStatus {
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

export const swagger = {
  summary: 'Create a new user',
  tags: ['account'],
  responses: {
    '201': {
      description: 'Returns access token and renew token',
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
  next: NextFunction
) => {
  const controller = new AccountController();
  const status = await controller.register(req, res);
  switch (status) {
    case AccountRegisterStatus.SUCCESS:
      res.status(200);
      break;
    case AccountRegisterStatus.BAD_REQUEST:
      res.status(400);
      break;
    case AccountRegisterStatus.USERNAME_ALREADY_EXISTS:
      res.status(409);
      res.json({
        message: "Username already exists"
      })
      break;
    case AccountRegisterStatus.REPEAT_PASSWORD_ERROR:
      res.status(409);
      res.json({
        message: "The repeat password does not match the password"
      })
      break;
  }
  next();
};
