import { UserService } from './userService';
import * as userModel from '../model/user';
import { User, Sex } from '../model/user';
import pool from '../database';

jest.mock('../model/user');
jest.mock('mysql2/promise', () => {
  const mockPool = {
      getConnection: jest.fn().mockResolvedValue({
          query: jest.fn().mockResolvedValue([[], []]),
          release: jest.fn(),
      }),
      end: jest.fn(),
  };
  return {
      createPool: jest.fn().mockReturnValue(mockPool),
  };
});

describe('UserService', () => {
  let userService: UserService;
  let mockUserModel: jest.Mocked<typeof userModel>;

  beforeEach(() => {
    userService = new UserService();
    mockUserModel = userModel as jest.Mocked<typeof userModel>;
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await pool.end();
  })

  it('should get users with limit and offset', async () => {
    const mockUsers: User[] = [
            {id: 1, 
            name: 'User 1',
            surname: 'User 1 surname',
            birth_date:  new Date('1990-01-01T00:00:00.000Z'),
             sex: Sex.Male
            },
            {id: 2,
            name: 'User 2',
            surname: 'User 2 surname',
            birth_date:  new Date('1990-01-01T00:00:00.000Z'),
             sex: Sex.Female}];
    mockUserModel.getUsers.mockResolvedValue(mockUsers);

    const users = await userService.getUsers(10, 0);

    expect(users).toEqual(mockUsers);
    expect(mockUserModel.getUsers).toHaveBeenCalledWith(10, 0);
  });

  it('should get users by group with limit and offset', async () => {
    const mockUsers: User[] = [
      {
        id: 3,
        name: 'User 3',
        surname: 'User 3 surname',
        birth_date: new Date('1990-01-01T00:00:00.000Z'),
        sex: Sex.Male,
      },
      {
        id: 4,
        name: 'User 4',
        surname: 'User 4 surname',
        birth_date: new Date('1995-05-15T00:00:00.000Z'),
        sex: Sex.Female,
      },
    ];
    mockUserModel.getUsersByGroup.mockResolvedValue(mockUsers);

    const users = await userService.getUsersByGroup('Admin', 10, 0);

    expect(users).toEqual(mockUsers);
    expect(mockUserModel.getUsersByGroup).toHaveBeenCalledWith('Admin', 10, 0);
  });

  it('should get a user by id', async () => {
    const mockUser: User = {
      id: 1,
      name: 'User 1',
      surname: 'User 1 surname',
      birth_date: new Date('1990-01-01T00:00:00.000Z'),
      sex: Sex.Male,
    };
    mockUserModel.getUserById.mockResolvedValue(mockUser);

    const user = await userService.getUserById(1);

    expect(user).toEqual(mockUser);
    expect(mockUserModel.getUserById).toHaveBeenCalledWith(1);
  });

  it('should create a user', async () => {
    const mockUser: User = { name: 'New User' } as User;
    mockUserModel.getUserByFields.mockResolvedValue([]);
    mockUserModel.createUser.mockResolvedValue(5);

    const userId = await userService.createUser(mockUser);

    expect(userId).toBe(5);
    expect(mockUserModel.getUserByFields).toHaveBeenCalledWith(mockUser);
    expect(mockUserModel.createUser).toHaveBeenCalledWith(mockUser);
  });

  it('should throw an error if user already exists', async () => {
    const mockUser: User = { name: 'Existing User' } as User;
    mockUserModel.getUserByFields.mockResolvedValue([mockUser]);

    await expect(userService.createUser(mockUser)).rejects.toThrow('User already exists');

    expect(mockUserModel.getUserByFields).toHaveBeenCalledWith(mockUser);
    expect(mockUserModel.createUser).not.toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const mockUser: User = {
      id: 1,
      name: 'Updated User',
      surname: 'Updated Surname',
      birth_date: new Date('1990-01-01T00:00:00.000Z'),
      sex: Sex.Male,
    };
    mockUserModel.updateUser.mockResolvedValue(undefined);

    await userService.updateUser(1, mockUser);

    expect(mockUserModel.updateUser).toHaveBeenCalledWith(1, mockUser);
  });

  it('should delete a user', async () => {
    mockUserModel.deleteUserToGroup.mockResolvedValue(undefined);
    mockUserModel.deleteUser.mockResolvedValue(undefined);

    await userService.deleteUser(1);

    expect(mockUserModel.deleteUserToGroup).toHaveBeenCalledWith(1);
    expect(mockUserModel.deleteUser).toHaveBeenCalledWith(1);
  });
});