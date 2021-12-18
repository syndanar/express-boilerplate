import {Request, Response, NextFunction} from 'express';
import * as Joi from 'joi';
import {PasswordPattern} from '@common/pattern';

export const requestBody: Joi.ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PasswordPattern).required(),
  repeatPassword: Joi.string().pattern(PasswordPattern).required(),
});

export const swagger = {
  summary: 'Update the user',
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

export const handler = async (req: Request, res: Response, next: NextFunction) => {
};
