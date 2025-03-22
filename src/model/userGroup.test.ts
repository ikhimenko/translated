import * as groupModel from './userGroup';
import pool from '../database';

jest.mock('../database', () => {
    const mockQuery = jest.fn();
    return {
        __esModule: true,
        default: {
            query: mockQuery,
        },
    };
});

describe('groupModel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get all groups successfully', async () => {
        const mockGroups = [{ id: 1, name: 'Group 1' }, { id: 2, name: 'Group 2' }];
        (pool.query as jest.Mock).mockResolvedValue([mockGroups]);

        const groups = await groupModel.getGroups();

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM user_groups');
        expect(groups).toEqual(mockGroups);
    });

    it('should get group by id successfully', async () => {
        const mockGroup = { id: 1, name: 'Group 1' };
        (pool.query as jest.Mock).mockResolvedValue([[mockGroup]]);

        const group = await groupModel.getGroupById(1);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM user_groups WHERE id = ?', [1]);
        expect(group).toEqual(mockGroup);
    });

    it('should create a group successfully', async () => {
        const mockInsertId = 123;
        (pool.query as jest.Mock).mockResolvedValue([{ insertId: mockInsertId }]);

        const groupId = await groupModel.createGroup({ name: 'New Group' });

        expect(pool.query).toHaveBeenCalledWith('INSERT INTO user_groups SET ?', [{ name: 'New Group' }]);
        expect(groupId).toEqual(mockInsertId);
    });

    it('should update a group successfully', async () => {
        (pool.query as jest.Mock).mockResolvedValue([{}]);

        await groupModel.updateGroup(1, { name: 'Updated Group' });

        expect(pool.query).toHaveBeenCalledWith('UPDATE user_groups SET ? WHERE id = ?', [{ name: 'Updated Group' }, 1]);
    });

    it('should delete a group successfully', async () => {
        (pool.query as jest.Mock).mockResolvedValue([{}]);

        await groupModel.deleteGroup(1);

        expect(pool.query).toHaveBeenCalledWith('DELETE FROM user_groups WHERE id = ?', [1]);
    });

    it('should add a user to a group successfully', async () => {
        (pool.query as jest.Mock).mockResolvedValue([{}]);

        await groupModel.addUserToGroup(1, 2);

        expect(pool.query).toHaveBeenCalledWith('INSERT INTO user_to_group (user_id, group_id) VALUES (?, ?)', [1, 2]);
    });

    it('should remove a user from a group successfully', async () => {
        (pool.query as jest.Mock).mockResolvedValue([{}]);

        await groupModel.removeUserFromGroup(1, 2);

        expect(pool.query).toHaveBeenCalledWith('DELETE FROM user_to_group WHERE user_id = ? AND group_id = ?', [1, 2]);
    });

    it('should get groups by user id successfully', async () => {
        const mockGroups = [{ id: 1, name: 'Group 1' }, { id: 2, name: 'Group 2' }];
        (pool.query as jest.Mock).mockResolvedValue([mockGroups]);

        const groups = await groupModel.getGroupsByUser(1);

        expect(pool.query).toHaveBeenCalledWith(
            'SELECT ug.* FROM user_groups ug JOIN user_to_group u2g ON ug.id = u2g.group_id WHERE u2g.user_id = ?',
            [1]
        );
        expect(groups).toEqual(mockGroups);
    });

    it('should handle error when getting groups', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(groupModel.getGroups()).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM user_groups');
    });

    it('should handle error when getting group by id', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(groupModel.getGroupById(1)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM user_groups WHERE id = ?', [1]);
    });

    it('should handle error when creating a group', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(groupModel.createGroup({ name: 'New Group' })).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('INSERT INTO user_groups SET ?', [{ name: 'New Group' }]);
    });

    it('should handle error when updating a group', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(groupModel.updateGroup(1, { name: 'Updated Group' })).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('UPDATE user_groups SET ? WHERE id = ?', [{ name: 'Updated Group' }, 1]);
    });

    it('should handle error when deleting a group', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(groupModel.deleteGroup(1)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM user_groups WHERE id = ?', [1]);
    });

    it('should handle error when adding a user to a group', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(groupModel.addUserToGroup(1, 2)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('INSERT INTO user_to_group (user_id, group_id) VALUES (?, ?)', [1, 2]);
    });

    it('should handle error when removing a user from a group', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(groupModel.removeUserFromGroup(1, 2)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith('DELETE FROM user_to_group WHERE user_id = ? AND group_id = ?', [1, 2]);
    });

    it('should handle error when getting groups by user id', async () => {
        const error = new Error('Database error');
        (pool.query as jest.Mock).mockRejectedValue(error);

        await expect(groupModel.getGroupsByUser(1)).rejects.toThrow(error);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT ug.* FROM user_groups ug JOIN user_to_group u2g ON ug.id = u2g.group_id WHERE u2g.user_id = ?',
            [1]
        );
    });
});