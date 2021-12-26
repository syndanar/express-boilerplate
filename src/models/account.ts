import {Schema, model, Document} from 'mongoose';
import {ITask} from '@/models/task';

export interface IAccount extends Document {
  _id: Schema.Types.ObjectId,
  email: string;
  password: string;
  avatar?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  tasks: ITask[]
}

export const AccountSchema = new Schema<IAccount>({
  password: {type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  firstName: String,
  middleName: String,
  lastName: String,
  avatar: String,
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
});

export const AccountModel = model<IAccount>('Account', AccountSchema);
