import { createUser, updateUser, validateUserId, validateGroupId } from './validator';
import { Request, Response } from 'express';

describe('Validator Tests', () => {
  describe('createUser schema', () => {
    it('should successfully validate a valid user object', () => {
      const validUser = {
        name: 'John',
        surname: 'Doe',
        birth_date: new Date('1990-01-01'),
        sex: 'male',
      };
      const { error } = createUser.validate(validUser);
      expect(error).toBeUndefined();
    });

    it('should fail validation if required fields are missing', () => {
      const invalidUser = {
        surname: 'Doe',
        birth_date: new Date('1990-01-01'),
        sex: 'male',
      };
      const { error } = createUser.validate(invalidUser);
      expect(error).toBeDefined();
      expect(error?.details.some(detail => detail.message.includes('"name" is required'))).toBe(true);
    });

    it('should fail validation if sex is invalid', () => {
      const invalidUser = {
        name: 'John',
        surname: 'Doe',
        birth_date: new Date('1990-01-01'),
        sex: 'invalid',
      };
      const { error } = createUser.validate(invalidUser);
      expect(error).toBeDefined();
      expect(error?.details.some(detail => detail.message.includes('"sex" must be one of [male, female, other]'))).toBe(true);
    });

    it('should fail validation if birth_date is not a date', () => {
      const invalidUser = {
        name: 'John',
        surname: 'Doe',
        birth_date: 'not a date',
        sex: 'male',
      };
      const { error } = createUser.validate(invalidUser);
      expect(error).toBeDefined();
      expect(error?.details.some(detail => detail.message.includes('"birth_date" must be a valid date'))).toBe(true);
    });
  });

  describe('updateUser schema', () => {
    it('should successfully validate a valid update user object with all fields', () => {
      const validUpdateUser = {
        name: 'Updated John',
        surname: 'Updated Doe',
        birth_date: new Date('1995-05-05'),
        sex: 'female',
      };
      const { error } = updateUser.validate(validUpdateUser);
      expect(error).toBeUndefined();
    });

    it('should successfully validate a valid update user object with some fields', () => {
      const validUpdateUser = {
        name: 'Updated John',
      };
      const { error } = updateUser.validate(validUpdateUser);
      expect(error).toBeUndefined();
    });

    it('should fail validation if sex is invalid in update', () => {
      const invalidUpdateUser = {
        sex: 'wrong',
      };
      const { error } = updateUser.validate(invalidUpdateUser);
      expect(error).toBeDefined();
      expect(error?.details.some(detail => detail.message.includes('"sex" must be one of [male, female, other]'))).toBe(true);
    });

    it('should successfully validate an empty update object', () => {
      const emptyUpdate = {};
      const { error } = updateUser.validate(emptyUpdate);
      expect(error).toBeUndefined();
    });
  });

  describe('validateUserId function', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });
      mockRequest = {
        params: {},
      };
      mockResponse = {
        status: mockStatus,
        json: mockJson,
      } as Partial<Response>;
    });

    it('should return a valid user ID if req.params.id is a number', () => {
      mockRequest.params = { id: '123' };
      const userId = validateUserId(mockRequest as Request, mockResponse as Response);
      expect(userId).toBe(123);
      expect(mockStatus).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    it('should return null and send a 400 error if req.params.id is not a number', () => {
      mockRequest.params = { id: 'abc' };
      const userId = validateUserId(mockRequest as Request, mockResponse as Response);
      expect(userId).toBeNull();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Error User ID is not valid' });
    });

    it('should return null and send a 400 error if req.params.id is missing', () => {
      const userId = validateUserId(mockRequest as Request, mockResponse as Response);
      expect(userId).toBeNull();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Error User ID is not valid' });
    });
  });

  describe('validateGroupId function', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });
      mockRequest = {
        params: {},
      };
      mockResponse = {
        status: mockStatus,
        json: mockJson,
      } as Partial<Response>;
    });

    it('should return a valid group ID if req.params.id is a number', () => {
      mockRequest.params = { id: '456' };
      const groupId = validateGroupId(mockRequest as Request, mockResponse as Response);
      expect(groupId).toBe(456);
      expect(mockStatus).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    it('should return null and send a 400 error if req.params.id is not a number', () => {
      mockRequest.params = { id: 'def' };
      const groupId = validateGroupId(mockRequest as Request, mockResponse as Response);
      expect(groupId).toBeNull();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Error Group ID is not valid' });
    });

    it('should return null and send a 400 error if req.params.id is missing', () => {
      const groupId = validateGroupId(mockRequest as Request, mockResponse as Response);
      expect(groupId).toBeNull();
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Error Group ID is not valid' });
    });
  });
});