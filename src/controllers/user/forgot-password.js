import bcrypt from 'bcryptjs';

import { UserRepo } from '../../models/index.js';
import { validateForgotPassword } from '../../validators/user.validator.js';

const { hash } = bcrypt;
const salt = 10;

export default async (req, res) => {
    try {
        const { error } = validateForgotPassword(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const hashed = await hash(req.body.password, salt);

        await UserRepo.update({ id: req.user.id }, { password: hashed });

        return res.status(200).json({
            message: 'Your new password was created successfully.',
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /user/forgot-password:
 *    post:
 *      summary: Saves the Password when Forgot
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *            type: string
 *          description: Put access token here
 *      requestBody:
 *        description: New password
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The new password was created successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "400":
 *          description: Please provide a password longer than 6, less than 20 characters.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "401":
 *          description: Invalid token.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */
