import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Enum representing possible values for a user's gender.
 */
export enum Sex {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}

/**
 * Interface representing a user entity.
 */
export interface User {
    /**
     * The unique identifier of the user.
     * Optional field for newly created users.
     */
    id?: number;

    /**
     * The first name of the user.
     */
    name: string;

    /**
     * The last name of the user.
     */
    surname: string;

    /**
     * The birth date of the user.
     */
    birth_date: Date;

    /**
     * The gender of the user.
     */
    sex: Sex;
}

/**
 * Retrieves a list of users with pagination.
 * @param {number} limit - The maximum number of users to retrieve.
 * @param {number} offset - The starting point for retrieving users.
 * @returns {Promise<User[]>} A promise that resolves to a list of users.
 */
export async function getUsers(limit: number, offset: number): Promise<User[]> {
    const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
    return users as User[];
}

/**
 * Retrieves a list of users belonging to a specific group with pagination.
 * @param {string} groupName - The name of the group to filter users by.
 * @param {number} limit - The maximum number of users to retrieve.
 * @param {number} offset - The starting point for retrieving users.
 * @returns {Promise<User[]>} A promise that resolves to a list of users in the group.
 */
export async function getUsersByGroup(groupName: string, limit: number, offset: number): Promise<User[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT u.*' +
        'FROM users u ' +
        'JOIN user_to_group u2g ON u.id = u2g.user_id ' +
        'JOIN user_groups ug ON u2g.group_id = ug.id ' +
        'WHERE ug.name = ? ' +
        'LIMIT ? OFFSET ?', [groupName, limit, offset]);

    return rows as User[];
}

/**
 * Retrieves a user by their unique ID.
 * @param {number} id - The ID of the user to retrieve.
 * @returns {Promise<User | null>} A promise that resolves to the user object or null if not found.
 */
export async function getUserById(id: number): Promise<User | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] as User || null;
}

/**
 * Creates a new user in the database.
 * @param {User} user - The user object to create.
 * @returns {Promise<number>} A promise that resolves to the ID of the newly created user.
 */
export async function createUser(user: User): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO users SET ?', [user]);
    return result.insertId;
}

/**
 * Updates an existing user in the database.
 * @param {number} id - The ID of the user to update.
 * @param {User} user - The updated user object.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function updateUser(id: number, user: User): Promise<void> {
    await pool.query('UPDATE users SET ? WHERE id = ?', [user, id]);
}

/**
 * Deletes a user from the database.
 * @param {number} id - The ID of the user to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteUser(id: number): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
}

/**
 * Deletes all user-to-group associations for a user.
 * @param {number} id - The ID of the user whose associations should be deleted.
 * @returns {Promise<void>} A promise that resolves when the associations are deleted.
 */
export async function deleteUserToGroup(id: number): Promise<void> {
    await pool.query('DELETE FROM user_to_group WHERE user_id = ?', [id]);
}

/**
 * Retrieves a list of users based on specific field values.
 * @param {User} user - The user object containing the field values to match.
 * @returns {Promise<User[]>} A promise that resolves to a list of matching users.
 */
export async function getUserByFields(user: User): Promise<User[]> {
    const [existingUsers] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE name = ? AND surname = ? AND birth_date = ? AND sex = ?',
        [user.name, user.surname, user.birth_date, user.sex]);
    return existingUsers as User[];
}