import mongoose, { Types } from 'mongoose';
import { IUser } from './user';

export async function initialize_DB() {
  try {
    let db_url = process.env.DB_URL;
    if (db_url) {
      await mongoose.connect(db_url);
      console.log('Connected to database.');
    } else {
      throw new Error('Could not connect to Database.');
    }
  } catch (e: any) {
    console.log(e.message);
  }
}

export type ID_Wrapper<t> = t & { _id: Types.ObjectId };
