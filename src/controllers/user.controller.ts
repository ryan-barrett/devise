import { logger } from '../utils/logger';
import { generateId } from '../utils/generate.id';
import { UserModel } from '../models/user.model';
import { validateBoards } from '../utils/controller.utils';
import { ControllerError } from '../errors';
import type { UserId, UserData } from '../typescript';

class UserControllerError extends ControllerError {
}

export class UserController {
  public static async Get(userId: UserId) {
    return await UserModel.Find(userId);
  }

  public static async Create(newUserData: UserData): Promise<any> {
    newUserData.id = `user-${await generateId()}`;
    newUserData.boards = [];

    const newUser = new UserModel(newUserData);
    const response = await UserModel.Put(newUser);

    logger.info({ response }, 'new user created',);
    return await UserController.Get(newUserData.id);
  }

  public static async Update(userData: UserData): Promise<any> {
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
