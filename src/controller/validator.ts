import Joi from 'joi';
import { Request, Response } from 'express';

const ERROR_USER_ID = "Error User ID is not valid";
const ERROR_GROUP_ID = "Error Group ID is not valid";

/**
 * Schema for creating a new user.
 * Validates the required fields: name, surname, birth_date, and sex.
 */
export const createUser = Joi.object({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    birth_date: Joi.date().required(),
    sex: Joi.string().valid('male', 'female', 'other').required(),
});

/**
 * Schema for updating an existing user.
 * Allows partial updates with optional fields: name, surname, birth_date, and sex.
 */
export const updateUser = Joi.object({
    name: Joi.string(),
    surname: Joi.string(),
    birth_date: Joi.date(),
    sex: Joi.string().valid('male', 'female', 'other'),
});

/**
 * Validates the user ID from the request parameters.
 * If the ID is invalid, it sends a 400 response with an error message.
 * @param {Request} req - The Express request object containing the user ID in parameters.
 * @param {Response} res - The Express response object.
 * @returns {number | null} The valid user ID as a number, or null if validation fails.
 */
export function validateUserId(req: Request, res: Response): number | null {
    return validateId(req, res, ERROR_USER_ID);
}

/**
 * Validates the group ID from the request parameters.
 * If the ID is invalid, it sends a 400 response with an error message.
 * @param {Request} req - The Express request object containing the group ID in parameters.
 * @param {Response} res - The Express response object.
 * @returns {number | null} The valid group ID as a number, or null if validation fails.
 */
export function validateGroupId(req: Request, res: Response): number | null {
    return validateId(req, res, ERROR_GROUP_ID);
}

/**
 * Validates a numeric ID from the request parameters.
 * If the ID is invalid, it sends a 400 response with a provided error message.
 * @param {Request} req - The Express request object containing the ID in parameters.
 * @param {Response} res - The Express response object.
 * @param {string} message - The error message to send if validation fails.
 * @returns {number | null} The valid ID as a number, or null if validation fails.
 */
function validateId(req: Request, res: Response, message: string): number | null {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).json({ error: message });
        return null;
    }
    return userId;
}