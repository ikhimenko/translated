import * as user from './user';
import pool from '../database';
import { Sex, User } from './user';

jest.mock('../database', () => {
    const mockQuery = jest.fn();
    return {
        __esModule: true,
        default: {
            query: mockQuery,
        },
    };
});

describe('user', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockUser: User = {
        name: 'User',
        surname: 'User surname',
        birth_date: new Date('1990-01-01'),
        sex: Sex.Male,
    };

    it('should get users successfully', async () => {
        const mockUsers = [{ id: 1, ...mockUser }, { id: 2, ...mockUser }];
        (pool.query as jest.Mock).mockResolvedValue([mockUsers]);

        const users = await user.getUsers(10, 0);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users LIMIT ? OFFSET ?', [10, 0]);
        expect(users).toEqual(mockUsers);
    });

    it('should get users by group successfully', async () => {
        const mockUsers = [{ id: 1, ...mockUser }, { id: 2, ...mockUser }];
        (pool.query as jest.Mock).mockResolvedValue([mockUsers]);

        const users = await user.getUsersByGroup('TestGroup', 10, 0);

        expect(pool.query).toHaveBeenCalledWith(
            'SELECT u.*FROM users u JOIN user_to_group u2g ON u.id = u2g.user_id JOIN user_groups ug ON u2g.group_id = ug.id WHERE ug.name = ? LIMIT ? OFFSET ?',
            ['TestGroup', 10, 0]
        );
        expect(users).toEqual(mockUsers);
    });

    it('should get user by id successfully', async () => {
        const mockUserWithId = { id: 1, ...mockUser };
        (pool.query as jest.Mock).mockResolvedValue([[mockUserWithId]]);

        const singleUser = await user.getUserById(1);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [1]);
        expect(singleUser).toEqual(mockUserWithId);
    });

    it('should return null when user by id is not found', async () => {
        (pool.query as jest.Mock).mockResolvedValue([[]]);

        const singleUser = await user.getUserById(999);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [999]);
        expect(singleUser).toBeNull();
    });

    it('should create a user successfully', async () => {
        const mockInsertId = 123;
        (pool.query as jest.Mock).mockResolvedValue([{ insertId: mockInsertId }]);

        const userId = await user.createUser(mockUser);

        expect(pool.query).toHaveBeenCalledWith('INSERT INTO users SET ?', [mockUser]);
        expect(userId).toEqual(mockInsertId);
    });

    it('should update a user successfully', async () => {
        (pool.query as jest.Mock).mockResolvedValue([{}]);

        await user.updateUser(1, { ...mockUser, name: 'UpdatedName' });

        expect(pool.query).toHaveBeenCalledWith('UPDATE users SET ? WHERE id = ?', [{ ...mockUser, name: 'UpdatedName' }, 1]);
    });

    it('should delete a user successfully', async () => {
        (pool.query as jest.Mock).mockResolvedValue([{}]);

        await user.deleteUser(1);

        expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [1]);
    });

    it('should delete user from group successfully', async () => {
        (pool.query as jest.Mock).mockResolvedValue([{}]);

        await user.deleteUserToGroup(1);

        expect(pool.query).toHaveBeenCalledWith('DELETE FROM user_to_group WHERE user_id = ?', [1]);
    });

    it('should get user by fields successfully', async () => {
        const mockUsers = [{ id: 1, ...mockUser }];
        (pool.query as jest.Mock).mockResolvedValue([mockUsers]);

        const users = await user.getUserByFields(mockUser);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE name = ? AND surname = ? AND birth_date = ? AND sex = ?', [
            mockUser.name,
            mockUser.surname,
            mockUser.birth_date,
            mockUser.sex,
        ]);
        expect(users).toEqual(mockUsers);
    });

    it('should handle error when getting users', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(user.getUsers(10, 0)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users LIMIT ? OFFSET ?', [10, 0]);
    });

    it('should handle error when getting users by group', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(user.getUsersByGroup('TestGroup', 10, 0)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT u.*FROM users u JOIN user_to_group u2g ON u.id = u2g.user_id JOIN user_groups ug ON u2g.group_id = ug.id WHERE ug.name = ? LIMIT ? OFFSET ?',
            ['TestGroup', 10, 0]
        );
    });

    it('should handle error when getting user by id', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(user.getUserById(1)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [1]);
    });

    it('should handle error when creating a user', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(user.createUser(mockUser)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('INSERT INTO users SET ?', [mockUser]);
    });

    it('should handle error when updating a user', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(user.updateUser(1, { ...mockUser, name: 'UpdatedName' })).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('UPDATE users SET ? WHERE id = ?', [{ ...mockUser, name: 'UpdatedName' }, 1]);
    });

    it('should handle error when deleting a user', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(user.deleteUser(1)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [1]);
    });

    it('should handle error when deleting a user to group', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(user.deleteUserToGroup(1)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM user_to_group WHERE user_id = ?', [1]);
    });
});