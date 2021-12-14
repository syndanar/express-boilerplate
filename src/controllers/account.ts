import {Request, Response} from 'express';
import joiSchemaRegister from '../validate/account/register';
import * as Joi from 'joi';
import {joiSchemaValidate} from '@utils/validate';
import { AccountLoginStatus } from '@routes/account/login-post';
import { AccountRegisterStatus } from '@/routes/account/register-post';
import { AccountModel } from '@/models/account';
import bcrypt from 'bcrypt'
import * as randToken from 'rand-token'

const saltRounds = 12;

const passwordHash = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds)
  return bcrypt.hashSync(password, salt)
}

const passwordCompare = async (password: string, hash: string) => {
  return new Promise(resolve => {
    bcrypt.compare(password, hash, function(err, result) {
      if(result) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

const authData = (accountDocument: any) => {
  return {
    id: accountDocument._id.toString(),
    token: accountDocument.token,
    renewToken: accountDocument.renewToken
  }
}

class AccountController {

  async register(req: Request, res: Response): Promise<AccountRegisterStatus> {
    return new Promise(async (resolve) => {
      const value = joiSchemaValidate(joiSchemaRegister, req, res);
      if (value) {
        if(value.password !== value.repeatPassword) {
          resolve(AccountRegisterStatus.REPEAT_PASSWORD_ERROR)
        } else {
          const dublicateExists = await AccountModel.exists({ email: value.email });
          if(!dublicateExists) {
            value.password = passwordHash(value.password)
            const account = new AccountModel(value)
            const accountDocument = await account.save();
            res.json(authData(accountDocument))
            resolve(AccountRegisterStatus.SUCCESS)
          } else {
            resolve(AccountRegisterStatus.USERNAME_ALREADY_EXISTS)
          }
        }
      } else {
        resolve(AccountRegisterStatus.BAD_REQUEST)
      }
    })
  }

  async login(req: Request, res: Response): Promise<AccountLoginStatus> {
    return new Promise(async (resolve) => {
      const value = joiSchemaValidate(joiSchemaRegister, req, res);
      if (value) {
        const accountDocument = await AccountModel.findOne({ email: value.email })
        if(accountDocument === null) {
          resolve(AccountLoginStatus.USERNAME_NOT_FOUND)
        } else {
          if(await passwordCompare(value.password, accountDocument.password)) {
            res.json(authData(accountDocument))
            resolve(AccountLoginStatus.SUCCESS)
          } else {
            resolve(AccountLoginStatus.PASSWORD_INCORRECT)
          }
        }
      }
      resolve(AccountLoginStatus.BAD_REQUEST)
    })
  }

  async update(req: Request, res: Response) {
    const value = joiSchemaValidate(joiSchemaRegister, req, res);
    if (value) {
      res.json({
        message: 'ok',
      });
    }
  }
}
export default AccountController;
