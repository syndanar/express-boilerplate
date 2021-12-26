import {Request, Response} from 'express';
import {joiSchemaValidate} from '@utils/validate';
import * as routeLoginPost from '@routes/account/login-post';
import * as routeRegisterPost from '@/routes/account/register-post';
import {AccountModel, IAccount} from '@/models/account';
import * as bcrypt from 'bcrypt';

const saltRounds = 12;

const passwordHash = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const passwordCompare = (password: string, hash: string): Promise<boolean> => {
  return new Promise((resolve) => {
    bcrypt.compare(password, hash, function(err, result) {
      resolve(result);
    });
  });
};

/**
 * Account controller
 */
class AccountController {
  /**
   * Register a new user
   * @param {e.Request} req
   * @param {e.Response} res
   * @return {Promise<routeRegisterPost.Status>}
   */
  async register(req: Request, res: Response): Promise<routeRegisterPost.Status | IAccount> {
    return new Promise((resolve) => {
      const value = joiSchemaValidate(routeRegisterPost.requestBody, req, res);

      if (!value) {
        resolve(routeRegisterPost.Status.BAD_REQUEST);
      }
      if (value.password !== value.repeatPassword) {
        resolve(routeRegisterPost.Status.REPEAT_PASSWORD_ERROR);
      } else {
        AccountModel.exists({email: value.email}).then((exists) => {
          if (!exists) {
            value.password = passwordHash(value.password);
            const account = new AccountModel(value);
            account.save().then((document: IAccount) => {
              resolve(document);
            });
          } else {
            resolve(routeRegisterPost.Status.USERNAME_ALREADY_EXISTS);
          }
        });
      }
    });
  }

  /**
   * Login the user
   * @param {e.Request} req
   * @param {e.Response} res
   * @return {Promise<routeLoginPost.Status>}
   */
  async login(req: Request, res: Response): Promise<routeLoginPost.Status | IAccount> {
    return new Promise((resolve) => {
      const value = joiSchemaValidate(routeLoginPost.requestBody, req, res);
      if (!value) {
        resolve(routeLoginPost.Status.BAD_REQUEST);
      }
      AccountModel.findOne({email: value.email})
          .then((accountDocument: IAccount) => {
            if (accountDocument === null) {
              resolve(routeLoginPost.Status.USERNAME_NOT_FOUND);
            } else {
              passwordCompare(value.password, accountDocument.password)
                  .then((isEqual: boolean) => {
                    console.log(isEqual);
                    resolve(isEqual ? accountDocument : routeLoginPost.Status.PASSWORD_INCORRECT);
                  });
            }
          });
    });
  }
}
export default AccountController;
