import { BlockRepo, PostRepo, ReactRepo } from '../../models/index.js';

export const react = async (req, res) => {
    try {
        // check if current user is blocked by the post owner
        const block = await BlockRepo.findOne({
            where: {
                blocker: { id: req.params.userId },
                blocked: { id: req.user.id },
            },
        });

        if (block) {
            return res.status(403).json({
                error: 'You do not have permission to react to this post.',
            });
        }

        const post = await PostRepo.findOne({
            where: {
                id: req.params.postId,
            },
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found.',
            });
        }

        const reaction = await ReactRepo.findOne({
            where: {
                post: { id: post.id },
                user: { id: req.user.id },
            },
        });

        if (reaction) {
            await ReactRepo.remove(reaction);

            return res.status(200).json({
                message: 'Reaction removed successfully.',
            });
        }

        const react = ReactRepo.create({
            post: post,
            user: req.user,
        });

        await ReactRepo.save(react);

        return res.status(200).json({
            message: 'Reaction updated successfully.',
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
 * /post/{postId}/react:
 *   post:
 *     summary: React to a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to react to
 *     responses:
 *       "200":
 *         description: Reaction updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reaction updated successfully.
 *       "403":
 *         description: You do not have permission to react to this post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: You do not have permission to react to this post.
 *       "404":
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Post not found.
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
