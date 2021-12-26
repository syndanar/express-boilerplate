import {Schema, model, Document} from 'mongoose';
import {IAccount} from '@/models/account';

export interface ITask extends Document {
  _id: Schema.Types.ObjectId,
  title: string;
  description: string;
  owner: IAccount;
  assign: IAccount | null;
  viewers: IAccount[]
}

export const TaskSchema = new Schema<ITask>({
  title: {type: String, required: true},
  description: String,
  owner: {type: Schema.Types.ObjectId, ref: 'Account'},
  assign: {type: Schema.Types.ObjectId, ref: 'Account'},
  viewers: [],
});

export const TaskModel = model<ITask>('Task', TaskSchema);
