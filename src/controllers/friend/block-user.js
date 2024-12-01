import { UserRepo, BlockRepo } from '../../models/index.js';
import { adminId } from '../../config/index.js';

export default async (req, res) => {
    try {
        const blockedId = req.params.blockedId;

        if (blockedId === req.user.id) {
            return res.status(400).json({ error: 'You cannot block yourself.' });
        }

        if (blockedId === adminId) {
            return res.status(400).json({ error: 'You cannot block the admin.' });
        }

        const blocked = await UserRepo.findOne({ where: { id: blockedId } });
        if (!blocked) {
            return res.status(404).json({ error: 'User not found.' });
        }

        let block = await BlockRepo.findOne({
            where: {
                blocker: { id: req.user.id },
                blocked: { id: blocked.id },
            },
        });

        if (block) {
            await BlockRepo.remove(block);

            return res.status(200).json({
                message: 'User unblocked successfully.',
            });
        }

        block = BlockRepo.create({
            blocker: req.user,
            blocked: blocked,
        });

        await BlockRepo.save(block);

        res.status(200).json({
            message: 'User blocked successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /friend/block/{blockedId}:
 *   post:
 *     summary: Block or unblock a user by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Friend
 *     parameters:
 *       - in: path
 *         name: blockedId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to block or unblock
 *     responses:
 *       "200":
 *         description: User blocked or unblocked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User blocked successfully.
 *       "400":
 *         description: You cannot block yourself or the admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You cannot block yourself or the admin.
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
