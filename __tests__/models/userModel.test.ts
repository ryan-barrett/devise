import { UserModel } from '../../src/models/user.model';
import { connection } from '../../src/data.source/cb.connection';

import Mock = jest.Mock;

describe('user.model.ts', () => {
  const stubUserData = {
    id: '1',
    userName: 'ryan',
    email: '111@test.com',
    boards: ['123'],
  };

  const cbResponse = new Promise((resolve, reject) => {
    resolve({
      value: stubUserData
    });
  });

  let getCallback: Mock<Promise<any>>;
  let upsertCallback: Mock<Promise<any>>;
  beforeEach(() => {
    getCallback = jest.fn(() => cbResponse);
    upsertCallback = jest.fn(() => cbResponse);

    connection.get = getCallback;
    connection.upsert = upsertCallback;
  });

  it('User should contain expected properties', () => {
    const user = new UserModel(stubUserData);
    expect(user.id).toBe('1');
    expect(user.userName).toBe('ryan');
    expect(user.email).toBe('111@test.com');
    expect(user.boards[0]).toBe('123');
  });

  it('should return a user from static find method', async () => {
    const user = await UserModel.find('1');
    expect(user.userName).toBe('ryan');
  });

  it('should return updated user from static put method', async () => {
    const response = await UserModel.find('1');
    const user = new UserModel(response);
    user.userName = 'steve';
    await UserModel.put(user);
    const secondResponse = await UserModel.find('1');
    const updatedUser = new UserModel(secondResponse);
    expect(updatedUser.getId()).toBe('1');
  });

  it('should call connection.get on find request', async () => {
    await UserModel.find('1');
    expect(getCallback.mock.calls.length).toBe(1);
  });

  it('should call connection.upsert on put request', async () => {
    const data = await UserModel.find('1');
    const user = new UserModel(data);
    await UserModel.put(user);
    expect(upsertCallback.mock.calls.length).toBe(1);
  });

  it('should return id from getId method', () => {
    const user = new UserModel(stubUserData);
    const id = user.getId();
    expect(id).toBe('1');
  });
});
