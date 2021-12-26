import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import {SECRET_KEY} from '@/config/jwt';
import {AccountModel, IAccount} from '@/models/account';
import {Session} from '@/session';
import {policyEvaluate} from '@common/policy';

export const accountMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const header = request?.headers?.authorization;
  if (header) {
    const aHeader = header.split(' ');
    if (aHeader.length === 2 && aHeader[0] === 'Bearer') {
      jwt.verify(aHeader[1], SECRET_KEY, function(err, decoded) {
        if (err) {
          response.status(err.name === 'TokenExpiredError' ? 401: 400);
          response.send(err.message);
        } else {
          AccountModel.findById(decoded._id)
              .then((accountDocument: IAccount) => {
                Session.setAccount(accountDocument);
              });
          next();
        }
      });
    }
  } else {
    next();
  }
};

export const policyMiddleware = (request: Request, response: Response, next: NextFunction) => {
  if (!policyEvaluate(request)) {
    console.log('1');
    response.status(401);
    response.send('Authentication required');
  } else {
    next();
  }
};

