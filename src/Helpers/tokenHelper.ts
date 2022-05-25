import jwt from 'jsonwebtoken';
import { IUser } from '../Models/user';
import { ID_Wrapper } from '../Models/init';
import randToken from 'rand-token';

// /***
//  * This method can be used to generate secret if you want to invalidate
//  * jwt token on user logout or password change.
//  * @param secret
//  * @param passwordHash
//  * @param lastLogin
//  */
// export function getJWTSecret(
//   secret: string,
//   passwordHash: string,
//   lastLogin: Date
// ) {
//   return `${passwordHash}+${secret}+${lastLogin.toString()}`;
// }

export const expiresIn = '1h';

export function createToken(user: ID_Wrapper<IUser>) {
  let secret = process.env.secret;
  if (secret) {
    return jwt.sign(
      {
        id: user._id,
        iss: 'todos',
        aud: 'todos',
      },
      secret,
      { algorithm: 'HS256', expiresIn: expiresIn }
    );
  } else {
    throw new Error('Secret not found.');
  }
}

export function getRefreshToken() {
  return randToken.uid(64);
}
