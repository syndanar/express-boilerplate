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
      if (result) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const authData = (accountDocument: any) => {
  return {
    id: accountDocument._id.toString(),
    token: accountDocument.token,
    renewToken: accountDocument.renewToken,
  };
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
  async register(req: Request, res: Response): Promise<routeRegisterPost.Status> {
    return new Promise((resolve) => {
      const value = joiSchemaValidate(routeRegisterPost.requestBody, req, res);
      if (value) {
        if (value.password !== value.repeatPassword) {
          resolve(routeRegisterPost.Status.REPEAT_PASSWORD_ERROR);
        } else {
          const dublicateExists = AccountModel.exists({email: value.email});
          if (!dublicateExists) {
            value.password = passwordHash(value.password);
            const account = new AccountModel(value);
            const accountDocument = account.save();
            res.json(authData(accountDocument));
            resolve(routeRegisterPost.Status.SUCCESS);
          } else {
            resolve(routeRegisterPost.Status.USERNAME_ALREADY_EXISTS);
          }
        }
      } else {
        resolve(routeRegisterPost.Status.BAD_REQUEST);
      }
    });
  }

  /**
   * Login the user
   * @param {e.Request} req
   * @param {e.Response} res
   * @return {Promise<routeLoginPost.Status>}
   */
  async login(req: Request, res: Response): Promise<routeLoginPost.Status> {
    return new Promise((resolve) => {
      const value = joiSchemaValidate(routeLoginPost.requestBody, req, res);
      if (value) {
        AccountModel.findOne({email: value.email})
            .then((accountDocument: IAccount) => {
              if (accountDocument === null) {
                resolve(routeLoginPost.Status.USERNAME_NOT_FOUND);
              } else {
                passwordCompare(value.password, accountDocument.password)
                    .then((isEqual: boolean) => {
                      if (isEqual ) {
                        res.json(authData(accountDocument));
                        resolve(routeLoginPost.Status.SUCCESS);
                      } else {
                        resolve(routeLoginPost.Status.PASSWORD_INCORRECT);
                      }
                    });
              }
            });
      }
      resolve(routeLoginPost.Status.BAD_REQUEST);
    });
  }
}
export default AccountController;
