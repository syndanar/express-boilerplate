import * as jwt from 'jsonwebtoken';

export const SECRET_KEY = 'SecretKeyMustBeChanged';

export const JWT_OPTIONS: jwt.SignOptions = {
  algorithm: 'HS256',
  expiresIn: 1,
  issuer: 'local',
};
