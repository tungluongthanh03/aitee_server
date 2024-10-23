import bcrypt from 'bcryptjs';

import { UserRepo } from '../../models/index.js';
import { validateChangePassword } from '../../validators/user.validator.js';

const { hash, compare } = bcrypt;
const salt = 10;

export default async (req, res) => {
    try {
        const { error } = validateChangePassword(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const user = await UserRepo.findOneBy({ id: req.user.id });
        const validPassword = await compare(req.body.newPassword, user.password);
        console.log(validPassword);

        if (validPassword) {
            return res.status(400).json({
                error: 'Your new password should not be same with the old one, please try a different password.',
            });
        }

        const hashed = await hash(req.body.newPassword, salt);
        user.password = hashed;

        await UserRepo.save(user);

        return res.status(200).json({
            message: 'Your password was changed successfully.',
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
 * /user/change-password:
 *    post:
 *      summary: Changes the Password
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          schema:
 *            type: string
 *          description: Put access token here
 *      requestBody:
 *        description: Old and new passwords
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newPassword:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: Your password was changed successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "400":
 *          description: Please provide old and new passwords that are longer than 6 letters and shorter than 20 letters.
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
