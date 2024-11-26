import { PostRepo } from '../../models/index.js';
import { validateUpdatePost } from '../../validators/post.validator.js';
import { uploadMedia, deleteMedia } from '../../services/cloudinary/index.js';

export const updatePost = async (req, res) => {
    try {
        const { error } = validateUpdatePost(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const post = await PostRepo.findOneBy({
            id: req.params.id,
        });

        if (!post) {
            return res.status(404).json({
                error: 'Post not found.',
            });
        }

        if (post.user.id !== req.user.id) {
            return res.status(403).json({
                error: 'You are not authorized to update this post.',
            });
        }

        if (req.body.content) {
            post.content = req.body.content;
        }

        if (req.files) {
            const media = req.files.map((file) => ({
                buffer: file.buffer,
            }));

            const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));

            const images = mediaUrls.filter((media) => media.includes('image'));
            const videos = mediaUrls.filter((media) => media.includes('video'));

            if (post.images) {
                post.images.forEach(async (image) => {
                    await deleteMedia(image, 'image');
                });
            }

            if (post.videos) {
                post.videos.forEach(async (video) => {
                    await deleteMedia(video, 'video');
                });
            }

            post.images = images;
            post.videos = videos;
        }

        await PostRepo.save(post);

        return res.status(200).json({
            message: 'Post updated successfully.',
            post,
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
 * /post/{id}:
 *   put:
 *     summary: Update a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update
 *     requestBody:
 *       description: Content and media files for the post
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the post
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       "200":
 *         description: Post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post updated successfully.
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       "400":
 *         description: Validation error for post content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       "403":
 *         description: You are not authorized to update this post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       "404":
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 *       "500":
 *         description: An internal server error occurred, please try again.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Result'
 */
