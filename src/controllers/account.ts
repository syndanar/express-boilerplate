import {Request, Response} from 'express';
import joiSchemaRegister from '../validate/account/register';
import * as Joi from 'joi';
import {joiSchemaValidate} from '@utils/validate';
import {ACCOUNT_LOGIN_STATUS} from '@routes/account/login-post';

class AccountController {
  register(req: Request, res: Response) {
    const value = joiSchemaValidate(joiSchemaRegister, req, res);
    if (value) {
      res.json({
        message: 'ok',
      });
    }
  }

  login(req: Request, res: Response): ACCOUNT_LOGIN_STATUS {
    const value = joiSchemaValidate(joiSchemaRegister, req, res);
    if (value) {
      res.json({
        message: 'ok',
      });
      return ACCOUNT_LOGIN_STATUS.SUCCESS;
    }
    return ACCOUNT_LOGIN_STATUS.PASSWORD_INCORRECT;
  }

  update(req: Request, res: Response) {
    const value = joiSchemaValidate(joiSchemaRegister, req, res);
    if (value) {
      res.json({
        message: 'ok',
      });
    }
  }
}
export default AccountController;
