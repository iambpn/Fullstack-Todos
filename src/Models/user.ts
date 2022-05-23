import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  name: string;
  email: string;
  phone_number: number;
  password: string;
}

export interface InstanceMethods {
  verifyPassword: (password: string) => Promise<boolean>;
}

export interface UserModel extends Model<IUser, {}, InstanceMethods> {}

const userSchema = new mongoose.Schema<IUser, UserModel, InstanceMethods>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone_number: { type: Number, required: true, unique: true, index: true },
  password: { type: String, required: true },
});

// adding a pre-save middleware to convert string password to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
  } catch (e: any) {
    console.log('Error while hashing Password.');
    console.log(e);
  }
});

// adding method to userSchema
userSchema.methods.verifyPassword = async function (password: string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (e) {
    return Promise.resolve(false);
  }
};

const UserModel = mongoose.model<IUser, UserModel, InstanceMethods>(
  'User',
  userSchema
);
export default UserModel;
