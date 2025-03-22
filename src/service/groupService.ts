import * as GroupModel from '../model/userGroup';
import { Group } from '../model/userGroup';

/**
 * Service responsible for managing user groups.
 * Provides methods to interact with the group data and perform CRUD operations.
 */
export class GroupService {
  /**
   * Retrieves all user groups.
   * @returns {Promise<Group[]>} A promise that resolves to a list of all groups.
   */
  async getGroups(): Promise<Group[]> {
    return GroupModel.getGroups();
  }

  /**
   * Retrieves a user group by its unique ID.
   * @param {number} id - The ID of the group to retrieve.
   * @returns {Promise<Group | null>} A promise that resolves to the group object or null if not found.
   */
  async getGroupById(id: number): Promise<Group | null> {
    return GroupModel.getGroupById(id);
  }

  /**
   * Creates a new user group.
   * @param {Group} group - The group object to create.
   * @returns {Promise<number>} A promise that resolves to the ID of the newly created group.
   */
  async createGroup(group: Group): Promise<number> {
    return GroupModel.createGroup(group);
  }

  /**
   * Updates an existing user group.
   * @param {number} id - The ID of the group to update.
   * @param {Group} group - The updated group object.
   * @returns {Promise<void>} A promise that resolves when the update is complete.
   */
  async updateGroup(id: number, group: Group): Promise<void> {
    return GroupModel.updateGroup(id, group);
  }

  /**
   * Deletes a user group.
   * @param {number} id - The ID of the group to delete.
   * @returns {Promise<void>} A promise that resolves when the group is deleted.
   */
  async deleteGroup(id: number): Promise<void> {
    return GroupModel.deleteGroup(id);
  }

  /**
   * Adds a user to a specific group.
   * @param {number} userId - The ID of the user to add.
   * @param {number} groupId - The ID of the group to which the user is added.
   * @returns {Promise<void>} A promise that resolves when the user is added to the group.
   */
  async addUserToGroup(userId: number, groupId: number): Promise<void> {
    return GroupModel.addUserToGroup(userId, groupId);
  }

  /**
   * Removes a user from a specific group.
   * @param {number} userId - The ID of the user to remove.
   * @param {number} groupId - The ID of the group from which the user is removed.
   * @returns {Promise<void>} A promise that resolves when the user is removed from the group.
   */
  async removeUserFromGroup(userId: number, groupId: number): Promise<void> {
    return GroupModel.removeUserFromGroup(userId, groupId);
  }

  /**
   * Retrieves all groups associated with a specific user.
   * @param {number} userId - The ID of the user to retrieve groups for.
   * @returns {Promise<Group[]>} A promise that resolves to a list of groups the user belongs to.
   */
  async getGroupsByUser(userId: number): Promise<Group[]> {
    return GroupModel.getGroupsByUser(userId);
  }
}