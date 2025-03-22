import { Request, Response } from 'express';
import { GroupService } from '../service/groupService';
import { Group } from '../model/userGroup';
import { validateGroupId, validateUserId } from './validator';

/**
 * Controller for managing group-related operations.
 * Handles CRUD operations and user-group interactions.
 */
export class GroupController {
    /**
     * Service instance for business logic.
     */
    private groupService: GroupService;

    /**
     * Constructor for initializing GroupController.
     * @param {GroupService} groupService - The service handling group operations.
     */
    constructor(groupService: GroupService) {
        this.groupService = groupService;
    }

    /**
     * Retrieves all groups in the system.
     * This handles requests to fetch the list of all available groups.
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     * @returns {Promise<void>} Resolves when the response is sent.
     */
    async getGroups(req: Request, res: Response): Promise<void> {
        try {
            const groups = await this.groupService.getGroups();
            res.status(200).json(groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Fetches a group by its unique identifier.
     * If the group does not exist, a 404 response is returned.
     * @param {Request} req - Express request object with group ID in parameters.
     * @param {Response} res - Express response object.
     * @returns {Promise<void>} Resolves when the response is sent.
     */
    async getGroupById(req: Request, res: Response): Promise<void> {
        try {
            const groupId = validateGroupId(req, res);
            if (groupId === null) {
                return; // Validation failure; response already sent.
            }

            const group = await this.groupService.getGroupById(groupId);

            if (group) {
                res.status(200).json(group);
            } else {
                res.status(404).json({ error: 'Group not found' });
            }
        } catch (error) {
            console.error('Error fetching group by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Creates a new group.
     * @param {Request} req - Express request object containing the group data in the body.
     * @param {Response} res - Express response object.
     * @returns {Promise<void>} Resolves when the response is sent.
     */
    async createGroup(req: Request, res: Response): Promise<void> {
        try {
            const group: Group = req.body;
            const groupId = await this.groupService.createGroup(group);
            res.status(201).json({ id: groupId, message: 'Group created successfully' });
        } catch (error) {
            console.error('Error creating group:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Updates an existing group by its ID.
     * @param {Request} req - Express request object containing the group ID in parameters and the updated data in the body.
     * @param {Response} res - Express response object.
     * @returns {Promise<void>} Resolves when the response is sent.
     */
    async updateGroup(req: Request, res: Response): Promise<void> {
        try {
            const groupId = validateGroupId(req, res);
            if (groupId === null) {
                return;
            }

            const group: Group = req.body;
            await this.groupService.updateGroup(groupId, group);
            res.status(204).send(); // No content response for successful updates.
        } catch (error) {
            console.error('Error updating group:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Deletes an existing group by its ID.
     * @param {Request} req - Express request object containing the group ID in parameters.
     * @param {Response} res - Express response object.
     * @returns {Promise<void>} Resolves when the response is sent.
     */
    async deleteGroup(req: Request, res: Response): Promise<void> {
        try {
            const groupId = validateGroupId(req, res);
            if (groupId === null) {
                return;
            }

            await this.groupService.deleteGroup(groupId);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting group:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Adds a user to a group.
     * @param {Request} req - Express request object containing the group ID in parameters and the user ID in the body.
     * @param {Response} res - Express response object.
     * @returns {Promise<void>} Resolves when the response is sent.
     */
    async addUserToGroup(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.body.userId);
            const groupId = parseInt(req.params.id);

            await this.groupService.addUserToGroup(userId, groupId);
            res.status(204).send();
        } catch (error) {
            console.error('Error adding user to group:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Removes a user from a group.
     * @param {Request} req - Express request object containing the group ID in parameters and the user ID in the body.
     * @param {Response} res - Express response object.
     * @returns {Promise<void>} Resolves when the response is sent.
     */
    async removeUserFromGroup(req: Request, res: Response): Promise<void> {
        try {
            const userId = parseInt(req.body.userId);
            const groupId = parseInt(req.params.id);

            await this.groupService.removeUserFromGroup(userId, groupId);
            res.status(204).send();
        } catch (error) {
            console.error('Error removing user from group:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Retrieves all groups associated with a specific user.
     * @param {Request} req - Express request object containing the user ID in parameters.
     * @param {Response} res - Express response object.
     * @returns {Promise<void>} Resolves when the response is sent.
     */
    async listGroupsByUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = validateUserId(req, res);
            if (userId === null) {
                return;
            }

            const groups = await this.groupService.getGroupsByUser(userId);
            res.status(200).json(groups);
        } catch (error) {
            console.error('Error fetching groups for user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}