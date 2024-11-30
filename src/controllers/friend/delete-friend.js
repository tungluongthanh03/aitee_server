import { UserRepo, FriendRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserRepo.findOneBy({ id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        let friend = await FriendRepo.findOne({
            where: [
                { acceptor: { id: req.user.id }, accepted: { id: user.id } },
                { acceptor: { id: user.id }, accepted: { id: req.user.id } },
            ],
        });

        if (!friend) {
            return res.status(404).json({ message: 'Friend not found.' });
        }

        await FriendRepo.remove(friend);

        res.json({ message: 'Friend deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /friend/delete-friend/{userId}:
 *   delete:
 *     summary: Delete a friend by user ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Friend
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete from friends
 *     responses:
 *       "200":
 *         description: Friend deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend deleted successfully.
 *       "404":
 *         description: User or friend not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User or friend not found.
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
