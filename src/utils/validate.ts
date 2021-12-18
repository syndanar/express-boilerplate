import {Request, Response} from 'express';
import * as Joi from 'joi';

/**
 * Validate request object by joiSchema and generate response if validate failed
 * @param {Joi.ObjectSchema} joiSchema
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {boolean} allowUnknown
 * @return {any}
 */
export function joiSchemaValidate(
    joiSchema: Joi.ObjectSchema,
    req: Request,
    res: Response,
    allowUnknown = false,
) {
  const validate = joiSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown,
    convert: false,
    errors: {
      wrap: {
        label: '',
      },
    },
  });
  if (validate.error) {
    const messages: Array<string> = [];
    validate.error.details.forEach((err: Joi.ValidationErrorItem) => {
      messages.push(err.message);
    });
    res.statusCode = 400;
    res.json({
      error: true,
      messages,
      data: validate.error,
    });
    return false;
  } else {
    return validate.value;
  }
}
