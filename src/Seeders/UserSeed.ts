import UserModel, { IUser } from '../Models/user';

export default async function seedUser() {
  let userData: IUser = {
    name: 'Admin',
    email: 'admin@gmail.com',
    password: '123@Admin',
    phone_number: 9895612356,
  };

  let user = await UserModel.findOne({ email: userData.email });
  if (!user) {
    user = new UserModel(userData);
    await user.save();
  }
}
