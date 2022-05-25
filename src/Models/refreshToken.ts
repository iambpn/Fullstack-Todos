import { Model, model, Schema, Types } from 'mongoose';

interface IRefreshToken {
  token: string;
  user: Types.ObjectId;
  updated_at: Date;
}

interface InstanceMethods {}

interface RefreshTokenModel extends Model<IRefreshToken, {}, InstanceMethods> {}

const schema = new Schema<IRefreshToken, RefreshTokenModel, InstanceMethods>({
  token: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updated_at: { type: Date, required: true, default: new Date() },
});

const RefreshToken = model<IRefreshToken, RefreshTokenModel, InstanceMethods>(
  'RefreshToken',
  schema
);

export default RefreshToken;
