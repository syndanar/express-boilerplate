import {IAccount} from '@/models/account';

export interface ISession {
  setAccount: (document: IAccount) => void,
  getAccount: () => null | IAccount,
}

let account: IAccount | null;

export const Session: ISession = {
  setAccount: function(document: IAccount) {
    account = document;
  },
  getAccount: function() {
    return account;
  },
};
