import bcrypt from 'bcryptjs';

import { validateRegister } from '../../validators/user.validator.js';
import { signAccessToken, signRefreshToken } from '../../services/auth/index.js';
import { UserRepo } from '../../models/index.js';

const { hash } = bcrypt;
const salt = 10;

export default async (req, res) => {
    try {
        const { error } = validateRegister(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const exists = await UserRepo.findOne({
            where: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
        });

        if (exists) return res.status(409).json({ error: 'User already exists' });

        const hashed = await hash(req.body.password, salt);

        let username = '';
        let tempName = '';
        let existsUsername = true;
        let name = req.body.firstName;
        if (name.includes(' ')) {
            tempName = name.trim().split(' ').slice(0, 1).join('').toLowerCase();
        } else {
            tempName = name.toLowerCase().trim();
        }
        do {
            username = tempName + Math.floor(Math.random() * 10000);
            existsUsername = await UserRepo.exists({ where: { username: username } });
        } while (existsUsername);

        const user = await UserRepo.create({
            email: req.body.email,
            username: username,
            phoneNumber: req.body.phoneNumber,
            password: hashed,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            sex: req.body.sex,
            birthday: req.body.birthday,
        });

        await UserRepo.save(user);

        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(user.id);

        // remove password from user object
        user.password = undefined;

        return res.status(200).json({
            message: 'You registered successfully.',
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
 * /user:
 *   post:
 *     summary: Registers the user
 *     requestBody:
 *       description: All required information about the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               sex:
 *                 type: string
 *                 enum: ['male', 'female', 'other']
 *               birthday:
 *                 type: string
 *                 format: date
 *     tags:
 *       - User
 *     responses:
 *       "200":
 *         description: You registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You registered successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "username123"
 *                     phoneNumber:
 *                       type: string
 *                       example: "1234567890"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     sex:
 *                       type: string
 *                       enum: ["male", "female", "other"]
 *                       example: "male"
 *                     birthday:
 *                       type: string
 *                       format: date
 *                       example: "1990-01-01"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       "400":
 *         description: Please provide all the required fields!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Please provide all the required fields!
 *       "409":
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An internal server error occurred, please try again.
 */
