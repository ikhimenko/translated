import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Interface representing a user group entity.
 */
export interface Group {
  /**
   * The unique identifier of the group.
   * Optional field for newly created groups.
   */
  id?: number;

  /**
   * The name of the group.
   */
  name: string;
}

/**
 * Retrieves all user groups from the database.
 * @returns {Promise<Group[]>} A promise that resolves to a list of all groups.
 */
export async function getGroups(): Promise<Group[]> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user_groups');
  return rows as Group[];
}

/**
 * Retrieves a user group by its unique ID.
 * @param {number} id - The ID of the group to retrieve.
 * @returns {Promise<Group | null>} A promise that resolves to the group object or null if not found.
 */
export async function getGroupById(id: number): Promise<Group | null> {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user_groups WHERE id = ?', [id]);
  return rows[0] as Group || null;
}

/**
 * Creates a new user group in the database.
 * @param {Group} group - The group object to create.
 * @returns {Promise<number>} A promise that resolves to the ID of the newly created group.
 */
export async function createGroup(group: Group): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>('INSERT INTO user_groups SET ?', [group]);
  return result.insertId;
}

/**
 * Updates an existing user group in the database.
 * @param {number} id - The ID of the group to update.
 * @param {Group} group - The updated group object.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function updateGroup(id: number, group: Group): Promise<void> {
  await pool.query('UPDATE user_groups SET ? WHERE id = ?', [group, id]);
}

/**
 * Deletes a user group from the database.
 * @param {number} id - The ID of the group to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteGroup(id: number): Promise<void> {
  await pool.query('DELETE FROM user_groups WHERE id = ?', [id]);
}

/**
 * Adds a user to a group.
 * @param {number} userId - The ID of the user to add.
 * @param {number} groupId - The ID of the group to add the user to.
 * @returns {Promise<void>} A promise that resolves when the user is added to the group.
 */
export async function addUserToGroup(userId: number, groupId: number): Promise<void> {
  await pool.query('INSERT INTO user_to_group (user_id, group_id) VALUES (?, ?)', [userId, groupId]);
}

/**
 * Removes a user from a group.
 * @param {number} userId - The ID of the user to remove.
 * @param {number} groupId - The ID of the group to remove the user from.
 * @returns {Promise<void>} A promise that resolves when the user is removed from the group.
 */
export async function removeUserFromGroup(userId: number, groupId: number): Promise<void> {
  await pool.query('DELETE FROM user_to_group WHERE user_id = ? AND group_id = ?', [userId, groupId]);
}

/**
 * Retrieves all groups associated with a specific user.
 * @param {number} userId - The ID of the user to retrieve groups for.
 * @returns {Promise<Group[]>} A promise that resolves to a list of groups the user belongs to.
 */
export async function getGroupsByUser(userId: number): Promise<Group[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ug.* FROM user_groups ug JOIN user_to_group u2g ON ug.id = u2g.group_id WHERE u2g.user_id = ?`, [userId]);
  return rows as Group[];
}