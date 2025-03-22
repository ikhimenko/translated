import { UserController } from './userController';
import { UserService } from '../service/userService';
import { Request, Response } from 'express';
import { createUser, updateUser, validateUserId } from './validator';
import { Sex } from '../model/user';

const mockUser1 = {
    id: 1,
    name: 'User 1',
    surname: 'User 1 surname',
    birth_date: new Date('1990-01-01T00:00:00.000Z'),
    sex: Sex.Male,
};

const mockUser2 = {
    id: 2,
    name: 'User 2',
    surname: 'User 2 surname',
    birth_date: new Date('1990-01-01T00:00:00.000Z'),
    sex: Sex.Female,
};

jest.mock('../service/userService');
jest.mock('./validator');
jest.mock('../model/user');
jest.mock('../service/userService', () => ({
    __esModule: true,
    UserService: jest.fn().mockImplementation(() => ({
        createUser: jest.fn().mockResolvedValue(12345),
        updateUser: jest.fn().mockResolvedValue(undefined),
        getUserById: jest.fn().mockResolvedValue(mockUser1),
        getUsers: jest.fn().mockResolvedValue([mockUser1, mockUser2]),
        getUsersByGroup: jest.fn().mockResolvedValue([mockUser1, mockUser2]),
        deleteUser: jest.fn().mockResolvedValue(undefined),
        deleteUserToGroup: jest.fn().mockResolvedValue(undefined)
    })),
}));
jest.mock('mysql2/promise', () => {
    const mockPool = {
        getConnection: jest.fn().mockResolvedValue({
            query: jest.fn().mockResolvedValue([[], []]),
            release: jest.fn(),
        }),
        end: jest.fn(),
    };
    return {
        createPool: jest.fn().mockReturnValue(mockPool),
    };
});

describe('UserController', () => {
    let userController: UserController;
    let mockUserService: jest.Mocked<UserService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockUserService = new UserService() as jest.Mocked<UserService>;
        userController = new UserController(mockUserService);
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it('should return welcome message', async () => {
        await userController.serverActivity(mockRequest as Request, mockResponse as Response);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Welcome Home' });
    });

    it('should create a user successfully', async () => {
        (createUser.validate as jest.Mock).mockReturnValue({ value: mockUser1 });
        mockUserService.createUser.mockResolvedValue(12345);

        await userController.createUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(12345);
    });

    it('should return 400 if validation fails during user creation', async () => {
        const mockError = { details: [{ message: 'Validation Error' }] };
        (createUser.validate as jest.Mock).mockReturnValue({ error: mockError });

        await userController.createUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Validation Error' });
    });

    it('should return 500 if an error occurs during user creation', async () => {
        (createUser.validate as jest.Mock).mockReturnValue({ value: {} });
        mockUserService.createUser.mockRejectedValue(new Error('Database Error'));

        await userController.createUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });

    it('should return 404 if user is not found', async () => {
        (validateUserId as jest.Mock).mockReturnValue(1);
        mockUserService.getUserById.mockResolvedValue(null);

        await userController.getUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
    
    it('should return 400 if validation fails during user creation', async () => {
        const mockError = { details: [{ message: 'Validation Error' }] };
        (createUser.validate as jest.Mock).mockReturnValue({ error: mockError });

        await userController.createUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Validation Error' });
    });

    it('should return 500 if an error occurs during user creation', async () => {
        (createUser.validate as jest.Mock).mockReturnValue({ value: {} });
        mockUserService.createUser.mockRejectedValue(new Error('Database Error'));

        await userController.createUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Database Error' });
    });

    it('should update a user successfully', async () => {
        (validateUserId as jest.Mock).mockReturnValue(1);
        (updateUser.validate as jest.Mock).mockReturnValue({ value: { name: 'Updated User' } });
        mockUserService.updateUser.mockResolvedValue(undefined);

        await userController.updateUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if validation fails during user update', async () => {
        (validateUserId as jest.Mock).mockReturnValue(1);
        const mockError = { details: [{ message: 'Validation Error' }] };
        (updateUser.validate as jest.Mock).mockReturnValue({ error: mockError });

        await userController.updateUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Validation Error' });
    });

    it('should return 500 if an error occurs during user update', async () => {
        (validateUserId as jest.Mock).mockReturnValue(1);
        (updateUser.validate as jest.Mock).mockReturnValue({ value: {} });
        mockUserService.updateUser.mockRejectedValue(new Error('Database Error'));

        await userController.updateUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should get a user successfully', async () => {
        (validateUserId as jest.Mock).mockReturnValue(mockUser1);
        mockUserService.getUserById.mockResolvedValue(mockUser1);

        await userController.getUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUser1);
    });

    it('should return 404 if user is not found', async () => {
        (validateUserId as jest.Mock).mockReturnValue(1);
        mockUserService.getUserById.mockResolvedValue(null);

        await userController.getUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 500 if an error occurs during get user', async () => {
        (validateUserId as jest.Mock).mockReturnValue(1);
        mockUserService.getUserById.mockRejectedValue(new Error('Database Error'));

        await userController.getUser(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    it('should list users successfully', async () => {
        mockRequest.query = { limit: '10', offset: '0' };
        const mockUsers = [mockUser1, mockUser2];
        mockUserService.getUsers.mockResolvedValue(mockUsers);

        await userController.listUsers(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should list users by group successfully', async () => {
        mockRequest.params = { groupName: 'TestGroup' };
        mockRequest.query = { limit: '10', offset: '0' };
        const mockUsers = [mockUser1, mockUser2];
        mockUserService.getUsersByGroup.mockResolvedValue(mockUsers);

        await userController.listUsersByGroup(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should delete a user successfully', async () => {
        (validateUserId as jest.Mock).mockReturnValue(1);
        mockUserService.deleteUser.mockResolvedValue(undefined);
        
        await userController.deleteUser(mockRequest as Request, mockResponse as Response);
    
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'user with id 1 deleted successfully' });
    });

});