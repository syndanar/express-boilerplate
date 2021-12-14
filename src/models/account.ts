import { Schema, model, Document } from 'mongoose';
import * as randToken from 'rand-token'

interface IAccount extends Document {
  email: string;
  token: string;
  renewToken: string;
  password: string;
  avatar?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

export const AccountSchema = new Schema<IAccount>({
  password: { type: String, required: true },
  token: {
    type: String,
    default: function() {
      return randToken.generate(64)
    }
  },
  renewToken: {
    type: String,
    default: function() {
      return randToken.generate(64)
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  firstName: String,
  middleName: String,
  lastName: String,
  avatar: String
});

export const AccountModel = model<IAccount>('Account', AccountSchema);
