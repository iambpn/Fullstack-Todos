import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  activity: {
    last_login: Date;
    last_update: Date;
  };
  name: string;
  email: string;
  phone_number: number;
  password: string;
  secretQuestion: string;
  secretAnswer: string;
}

export interface InstanceMethods {
  verifyPassword: (password: string) => Promise<boolean>;
  verifyAnswer: (answer: string) => Promise<boolean>;
}

export interface UserModel extends Model<IUser, {}, InstanceMethods> {}

const userSchema = new mongoose.Schema<IUser, UserModel, InstanceMethods>({
  activity: {
    last_login: { type: Date, default: new Date() },
    last_update: { type: Date, default: new Date() },
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone_number: { type: Number, required: true, unique: true, index: true },
  password: { type: String, required: true },
  secretQuestion: { type: String, required: true },
  secretAnswer: { type: 'String', required: true },
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
  } finally {
    this.activity.last_update = new Date();
  }
});

// adding a pre-save middleware to convert secret answer to hash digest
userSchema.pre('save', async function (next) {
  if (!this.isModified('secretAnswer')) {
    return next();
  }
  try {
    let salt = await bcrypt.genSalt(13);
    let hash = await bcrypt.hash(this.secretAnswer, salt);
    this.secretAnswer = hash;
    return next();
  } catch (e: any) {
    console.log('Error while hashing Secret Answer.');
    console.log(e);
  } finally {
    this.activity.last_update = new Date();
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

// adding method to userSchema
userSchema.methods.verifyAnswer = async function (answer: string) {
  try {
    return await bcrypt.compare(answer, this.secretAnswer);
  } catch (e) {
    return Promise.resolve(false);
  }
};

const User = mongoose.model<IUser, UserModel, InstanceMethods>(
  'User',
  userSchema
);
export default User;
