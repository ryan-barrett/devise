import jwt                 from 'jsonwebtoken';
import bcrypt              from 'bcrypt';
import config              from 'config';
import { UserModel }       from '../models';
import { ControllerError } from '../errors';
import type { User }       from '../types';
import { logger }          from '../utils/logger';

const jwtConfig: { [key: string]: any } = config.get('jwt');
const { publicKey, privateKey } = jwtConfig;

class AuthenticationControllerError extends ControllerError {
}

export class AuthenticationController {
  public static async MatchUser(email: string) {
    return UserModel.Match(email);
  }

  public static GenerateJwt(user: User) {
    const filteredUser = { ...user };
    delete filteredUser.password;
    return jwt.sign(user, privateKey, { algorithm: 'RS256' });
  }

  public static VerifyPassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }

  public static async ParseJwt(jwtToken: string) {
    try {
      // @ts-ignore
      const { email, id, userName, boards } = await jwt.verify(jwtToken, publicKey);
      return { email, id, userName, boards };
    }
    catch (error) {
      logger.error({ error }, 'error parsing jwt');
      return false;
    }
  }
}
