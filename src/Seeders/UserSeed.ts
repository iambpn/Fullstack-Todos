import UserModel, { IUser } from '../Models/user';

export default async function seedUser() {
  let userData: Partial<IUser> = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: '123@Admin',
    phone_number: 9895612356,
  };

  let user = await UserModel.findOne({ email: userData.email }).exec();
  if (!user) {
    user = new UserModel(userData);
    await user.save();
  }
}
