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

app.post('/users', (req: Request, res: Response) => userController.createUser(req, res));
app.get('/users/:id', (req: Request, res: Response) => userController.getUser(req, res));
app.get('/users', (req: Request, res: Response) => userController.listUsers(req, res));
app.put('/users/:id', (req: Request, res: Response) => userController.updateUser(req, res));
app.delete('/users/:id', (req: Request, res: Response) => userController.deleteUser(req, res));

app.get('/:groupName/users', (req: Request, res: Response) => userController.listUsersByGroup(req, res));
app.get('/:id/groups', (req: Request, res: Response) => groupController.listGroupsByUser(req, res));

app.get('/groups', (req: Request, res: Response) => groupController.getGroups(req, res));
app.get('/groups/:id', (req: Request, res: Response) => groupController.getGroupById(req, res));
app.post('/groups', (req: Request, res: Response) => groupController.createGroup(req, res));
app.put('/groups/:id', (req: Request, res: Response) => groupController.updateGroup(req, res));
app.delete('/groups/:id', (req: Request, res: Response) => groupController.deleteGroup(req, res));
app.post('/groups/:id/users', (req: Request, res: Response) => groupController.addUserToGroup(req, res));
app.delete('/groups/:id/users', (req: Request, res: Response) => groupController.removeUserFromGroup(req, res))


app.get('/', userController.serverActivity);

app.listen(port, () => {
  console.log(`Server listening at ${port}`);
});

export default app;