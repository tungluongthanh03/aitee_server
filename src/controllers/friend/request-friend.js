import { UserRepo, BlockRepo, FriendRepo, RequestRepo } from '../../models/index.js';
import {
    createFriendNotification,
    removeFriendNotification,
} from '../../services/notification/index.js';

export default async (req, res) => {
    try {
        const receiverId = req.params.receiverId;

        if (receiverId === req.user.id) {
            return res.status(400).json({ error: 'You cannot send a friend request to yourself.' });
        }

        const isBlocked = await BlockRepo.findOne({
            where: {
                blocker: { id: receiverId },
                blocked: { id: req.user.id },
            },
        });

        if (isBlocked) {
            return res.status(400).json({ error: 'You are blocked by the user.' });
        }

        const receiver = await UserRepo.findOne({ where: { id: receiverId } });

        if (!receiver) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isFriend = await FriendRepo.findOne({
            where: [
                { acceptor: { id: req.user.id }, accepted: { id: receiver.id } },
                { acceptor: { id: receiver.id }, accepted: { id: req.user.id } },
            ],
        });

        if (isFriend) {
            return res.status(400).json({ error: 'You are already friends.' });
        }

        // check if there is a request from the receiver
        const requestFromReceiver = await RequestRepo.findOne({
            where: {
                sender: { id: receiver.id },
                receiver: { id: req.user.id },
            },
        });

        if (requestFromReceiver) {
            return res
                .status(400)
                .json({ error: 'The user has already sent you a friend request.' });
        }

        let request = await RequestRepo.findOne({
            where: {
                sender: { id: req.user.id },
                receiver: { id: receiver.id },
            },
        });

        if (request) {
            await RequestRepo.remove(request);
            await removeFriendNotification(receiver, req.user.id, 'request');

            return res.status(200).json({
                message: 'Request removed successfully.',
            });
        }

        request = RequestRepo.create({
            sender: req.user,
            receiver: receiver,
        });

        await RequestRepo.save(request);
        await createFriendNotification(receiver, req.user.id, 'request');

        res.status(200).json({
            message: 'Request created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /friend/request/{receiverId}:
 *   post:
 *     summary: Send or remove a friend request
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Friend
 *     parameters:
 *       - in: path
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to send or remove a friend request
 *     responses:
 *       "200":
 *         description: Request created or removed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request created successfully.
 *       "400":
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You cannot send a friend request to yourself.
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found.
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
