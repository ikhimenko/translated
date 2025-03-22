import express, { Request, Response } from 'express';
import { UserController } from './controller/userController';
import { UserService } from './service/userService';
import { GroupService } from './service/groupService';
import { GroupController } from './controller/groupController';

const app = express();
const port = 3000;

app.use(express.json());

const userService = new UserService();
const groupService = new GroupService();

const userController = new UserController(userService);
const groupController = new GroupController(groupService);

/**
 * Endpoint to create a new user.
 */
app.post('/users', (req: Request, res: Response) => userController.createUser(req, res));

/**
 * Endpoint to retrieve a user by ID.
 */
app.get('/users/:id', (req: Request, res: Response) => userController.getUser(req, res));

/**
 * Endpoint to retrieve a list of users (with optional pagination).
 */
app.get('/users', (req: Request, res: Response) => userController.listUsers(req, res));

/**
 * Endpoint to update a user by ID.
 */
app.put('/users/:id', (req: Request, res: Response) => userController.updateUser(req, res));

/**
 * Endpoint to delete a user by ID.
 */
app.delete('/users/:id', (req: Request, res: Response) => userController.deleteUser(req, res));

/**
 * Endpoint to retrieve users belonging to a specific group by group name.
 */
app.get('/:groupName/users', (req: Request, res: Response) => userController.listUsersByGroup(req, res));

/**
 * Endpoint to retrieve groups associated with a specific user by user ID.
 */
app.get('/:id/groups', (req: Request, res: Response) => groupController.listGroupsByUser(req, res));

/**
 * Endpoint to retrieve a list of all groups.
 */
app.get('/groups', (req: Request, res: Response) => groupController.getGroups(req, res));

/**
 * Endpoint to retrieve a specific group by ID.
 */
app.get('/groups/:id', (req: Request, res: Response) => groupController.getGroupById(req, res));

/**
 * Endpoint to create a new group.
 */
app.post('/groups', (req: Request, res: Response) => groupController.createGroup(req, res));

/**
 * Endpoint to update an existing group by ID.
 */
app.put('/groups/:id', (req: Request, res: Response) => groupController.updateGroup(req, res));

/**
 * Endpoint to delete a group by ID.
 */
app.delete('/groups/:id', (req: Request, res: Response) => groupController.deleteGroup(req, res));

/**
 * Endpoint to add a user to a group by group ID.
 */
app.post('/groups/:id/users', (req: Request, res: Response) => groupController.addUserToGroup(req, res));

/**
 * Endpoint to remove a user from a group by group ID.
 */
app.delete('/groups/:id/users', (req: Request, res: Response) => groupController.removeUserFromGroup(req, res));

/**
 * Endpoint to check server activity.
 */
app.get('/', userController.serverActivity);

/**
 * Starts the server and listens on the specified port.
 */
app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

/**
 * The Express application instance representing the main server.
 * This is the default export of the module.
 */
export default app;
