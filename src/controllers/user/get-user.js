import { UserRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const id = req.user.id;
        const user = await UserRepo.findOneBy({ id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // remove password from user object
        user.password = undefined;

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get User Info
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       "200":
 *         description: The user information has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
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
 *                     address:
 *                       type: string
 *                       example: "123 Main St"
 *                     avatar:
 *                       type: string
 *                       example: "http://example.com/avatar.jpg"
 *                     online:
 *                       type: boolean
 *                       example: true
 *                     biography:
 *                       type: string
 *                       example: "This is a biography."
 *       "404":
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An internal server error occurred, please try again."
 */
