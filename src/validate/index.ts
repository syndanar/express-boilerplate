import UserLoginSchema from './account/login';
import UserRegisterSchema from './account/register';
import Joi from 'joi';

const schema: {[index: string]: Joi.ObjectSchema<any>} = {
  UserLoginSchema,
  UserRegisterSchema,
};
export default schema;
