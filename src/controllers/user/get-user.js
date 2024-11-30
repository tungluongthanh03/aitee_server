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
 *    get:
 *      summary: Get User Info
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      responses:
 *        "200":
 *          description: The user information has been retrieved successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user:
 *                              $ref: '#/components/schemas/User'
 *        "404":
 *          description: User not found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: User not found
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: An internal server error occurred, please try again.
 */
