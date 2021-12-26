import {Request} from 'express';
import {Session} from '@/session';

export const policyEvaluate = function(req: Request): boolean {
  const account = Session.getAccount();
  return !!account;
};
