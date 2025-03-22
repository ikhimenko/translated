import * as userModel from '../model/user';
import { User } from '../model/user';

/**
 * Service responsible for managing users.
 * Provides methods to interact with user data and perform CRUD operations.
 */
export class UserService {
    /**
     * Retrieves a paginated list of users.
     * @param {number} limit - The maximum number of users to retrieve.
     * @param {number} offset - The starting point for retrieving users.
     * @returns {Promise<User[]>} A promise that resolves to a list of users.
     */
    async getUsers(limit: number, offset: number): Promise<User[]> {
        return userModel.getUsers(limit, offset);
    }

    /**
     * Retrieves users belonging to a specific group with pagination.
     * @param {string} groupName - The name of the group to filter users by.
     * @param {number} limit - The maximum number of users to retrieve.
     * @param {number} offset - The starting point for retrieving users.
     * @returns {Promise<User[]>} A promise that resolves to a list of users in the group.
     */
    async getUsersByGroup(groupName: string, limit: number, offset: number): Promise<User[]> {
        return userModel.getUsersByGroup(groupName, limit, offset);
    }

    /**
     * Retrieves a user by their unique ID.
     * @param {number} id - The ID of the user to retrieve.
     * @returns {Promise<User | null>} A promise that resolves to the user object or null if not found.
     */
    async getUserById(id: number): Promise<User | null> {
        return userModel.getUserById(id);
    }

    /**
     * Creates a new user in the database.
     * Throws an error if a user with the same fields already exists.
     * @param {User} user - The user object to create.
     * @returns {Promise<number>} A promise that resolves to the ID of the newly created user.
     * @throws {Error} If a user with the same fields already exists.
     */
    async createUser(user: User): Promise<number> {
        if ((await userModel.getUserByFields(user)).length > 0) {
            throw new Error('User already exists');
        }
        return userModel.createUser(user);
    }

    /**
     * Updates an existing user in the database.
     * @param {number} id - The ID of the user to update.
     * @param {User} user - The updated user object.
     * @returns {Promise<void>} A promise that resolves when the update is complete.
     */
    async updateUser(id: number, user: User): Promise<void> {
        return userModel.updateUser(id, user);
    }

    /**
     * Deletes a user and all their group associations from the database.
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<void>} A promise that resolves when the user is deleted.
     */
    async deleteUser(id: number): Promise<void> {
        this.deleteUserToGroup(id);
        return userModel.deleteUser(id);
    }

    /**
     * Deletes all group associations for a specific user.
     * @param {number} id - The ID of the user whose group associations are deleted.
     * @returns {Promise<void>} A promise that resolves when the associations are deleted.
     */
    async deleteUserToGroup(id: number): Promise<void> {
        return userModel.deleteUserToGroup(id);
    }
}