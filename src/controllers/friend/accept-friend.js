import { UserRepo, FriendRepo, RequestRepo } from '../../models/index.js';
import {
    createFriendNotification,
    removeFriendNotification,
} from '../../services/notification/index.js';

export default async (req, res) => {
    try {
        const senderId = req.params.senderId;
        const sender = await UserRepo.findOne({ where: { id: senderId } });

        if (!sender) {
            return res.status(404).json({ error: 'User not found' });
        }

        let friend = await FriendRepo.findOne({
            where: [
                { acceptor: { id: req.user.id }, accepted: { id: sender.id } },
                { acceptor: { id: sender.id }, accepted: { id: req.user.id } },
            ],
        });

        if (friend) {
            return res.status(400).json({ error: 'You are already friends.' });
        }

        let request = await RequestRepo.findOne({
            where: {
                sender: { id: sender.id },
                receiver: { id: req.user.id },
            },
        });

        if (!request) {
            return res.status(404).json({ error: 'The friend request not found.' });
        }

        friend = FriendRepo.create({
            acceptor: req.user,
            accepted: sender,
        });

        await FriendRepo.save(friend);
        await RequestRepo.remove(request);
        await createFriendNotification(sender, req.user.id, 'accept');
        await removeFriendNotification(req.user, sender.id, 'request');

        res.status(200).json({ message: 'Friend request accepted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /friend/accept/{senderId}:
 *   post:
 *     summary: Accept a friend request
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Friend
 *     parameters:
 *       - in: path
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who sent the friend request
 *     responses:
 *       "200":
 *         description: Friend request accepted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend request accepted successfully.
 *       "400":
 *         description: You are already friends.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You are already friends.
 *       "404":
 *         description: User or friend request not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User or friend request not found.
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
