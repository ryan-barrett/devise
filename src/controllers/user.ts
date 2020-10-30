import bcrypt                                 from 'bcrypt';
import config                                 from 'config';
import { logger }                             from '../utils/logger';
import { generateId }                         from '../utils/generateId';
import { UserModel }                          from '../models';
import { validateBoards }                     from '../utils/controller';
import { ControllerError }                    from '../errors';
import type { UserId, UserData, User, Board } from '../typing';

const encryption: { [key: string]: any } = config.get('encryption');
const { saltRounds } = encryption;

class UserControllerError extends ControllerError {
}

export class UserController {
  public static async Get(userId: UserId): Promise<User> {
    return await UserModel.Find(userId);
  }

  public static async Create(newUserData: UserData): Promise<User> {
    newUserData.id = `user-${await generateId()}`;
    newUserData.boards = [];

    const { password } = newUserData;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUserData = { ...newUserData, password: hashedPassword };

    const newUser = new UserModel(updatedUserData);
    const response = await UserModel.Put(newUser);

    logger.info({ response }, 'new user created',);
    return await UserController.Get(newUserData.id);
  }

  public static async Update(userData: UserData): Promise<User> {
    const { id, userName, email, boards } = userData;

    if (boards !== undefined && !await validateBoards(boards)) {
      throw new UserControllerError(400, 'cannot update user with invalid boards');
    }

    const existingUser = await UserModel.Find(id);
    const { userName: existingUserName, email: existingEmail, boards: existingBoards } = existingUser;

    existingUser.userName = userName !== undefined ? userName : existingUserName;
    existingUser.email = email !== undefined ? email : existingEmail;
    existingUser.boards = boards !== undefined ? boards : existingBoards;

    const updatedUser = new UserModel(existingUser);
    const response = await UserModel.Put(updatedUser);

    logger.info({ id, response }, 'user updated');
    return await UserController.Get(id);
  }
}
