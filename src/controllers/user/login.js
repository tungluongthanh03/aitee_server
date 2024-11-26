import bcrypt from 'bcryptjs';

import { signAccessToken, signRefreshToken } from '../../services/auth/index.js';
import { validateLogin } from '../../validators/user.validator.js';
import { UserRepo } from '../../models/index.js';

const { compare } = bcrypt;

export default async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const user = await UserRepo.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res
                .status(400)
                .json({ error: 'You have entered an invalid email or password.' });
        }

        const match = await compare(req.body.password, user.password);
        if (!match) {
            return res
                .status(400)
                .json({ error: 'You have entered an invalid email or password.' });
        }

        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(user.id);

        // remove password from user object
        user.password = undefined;

        return res.status(200).json({
            message: 'You logged in successfully.',
            user,
            accessToken,
            refreshToken,
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
 * /user/login:
 *    post:
 *      summary: Login
 *      requestBody:
 *        description: Email and password information to login
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                password:
 *                  type: string
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: You logged in successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          user:
 *                              $ref: '#/components/schemas/User'
 *                          accessToken:
 *                              type: string
 *                          refreshToken:
 *                              type: string
 *        "400":
 *          description: Please provide all the required fields!
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
