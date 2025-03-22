import { Request, Response } from 'express';
import { UserService } from '../service/userService';
import { createUser, updateUser, validateUserId } from './validator';

/**
 * Controller responsible for handling user-related operations.
 * Manages user creation, updates, retrieval, listing, and deletion.
 */
export class UserController {
  /**
   * Service responsible for user-related business logic.
   */
  private userService: UserService;

  /**
   * Initializes the UserController.
   * @param {UserService} userService - The service handling user operations.
   */
  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Responds with a welcome message to indicate server activity.
   * @route GET /
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  async serverActivity(req: Request, res: Response) {
    res.status(200).json({ message: "Welcome Home" });
  }

  /**
   * Creates a new user after validating the input data.
   * @route POST /users
   * @param {Request} req - The Express request containing user data in the body.
   * @param {Response} res - The Express response object.
   */
  async createUser(req: Request, res: Response) {
    try {
      const { error, value } = createUser.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const newUser = await this.userService.createUser(value);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  /**
   * Updates an existing user after validating the input data.
   * @route PUT /users/:id
   * @param {Request} req - The Express request containing the user ID and update data.
   * @param {Response} res - The Express response object.
   */
  async updateUser(req: Request, res: Response) {
    try {
      const userId = validateUserId(req, res);
      if (userId === null) {
        return;
      }
      console.log(`Updating user with id ${userId}`);
      const { error, value } = updateUser.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const userToUpdate = value;
      await this.userService.updateUser(userId, value);
      res.status(201).json(userToUpdate);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Retrieves a specific user by their ID.
   * @route GET /users/:id
   * @param {Request} req - The Express request containing the user ID.
   * @param {Response} res - The Express response object.
   */
  async getUser(req: Request, res: Response) {
    try {
      const userId = validateUserId(req, res);
      if (userId === null) {
        return;
      }
      console.log(`Retrieving user for id ${userId}`);
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error('Error getting user', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retrieves a paginated list of users.
   * @route GET /users
   * @param {Request} req - The Express request containing pagination parameters (limit, offset).
   * @param {Response} res - The Express response object.
   */
  async listUsers(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    console.log("Retrieving users");
    try {
      const userList = await this.userService.getUsers(limit, offset);
      console.log(userList);
      if (userList.length < 1) {
        return res.status(404).json({ error: 'User list is empty' });
      }
      res.status(200).json(userList);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Retrieves a list of users filtered by a specific group name.
   * @route GET /users/group/:groupName
   * @param {Request} req - The Express request containing group name and pagination parameters.
   * @param {Response} res - The Express response object.
   */
  async listUsersByGroup(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const offset = parseInt(req.query.offset as string, 10) || 0;
    const groupName = req.params.groupName;
    console.log(groupName);
    console.log(`Retrieving users by group name ${groupName}`);
    try {
      const userList = await this.userService.getUsersByGroup(groupName, limit, offset);
      if (userList.length === 0) {
        res.status(404).json({ error: `Users list by group name ${groupName} is empty` });
      }
      res.status(200).json(userList);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Deletes a user by their ID.
   * @route DELETE /users/:id
   * @param {Request} req - The Express request containing the user ID.
   * @param {Response} res - The Express response object.
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = validateUserId(req, res);
      if (userId === null) {
        return;
      }
      console.log(`Deleting user with id ${userId}`);
      this.userService.deleteUser(userId);
      res.status(200).json({ message: `User with id ${userId} deleted successfully` });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}