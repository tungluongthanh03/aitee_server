import { PostRepo } from '../../models/index.js';
import { validateCreatePost } from '../../validators/post.validator.js';
import { uploadMedia } from '../../services/cloudinary/index.js';

export const createPost = async (req, res) => {
    try {
        const { error } = validateCreatePost(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const post = PostRepo.create({
            content: req.body.content,
            user: req.user,
        });

        if (req.files) {
            const media = req.files.map((file) => ({
                buffer: file.buffer,
                mimetype: file.mimetype,
            }));

            const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));

            const images = mediaUrls.filter((media) => media.includes('image'));
            const videos = mediaUrls.filter((media) => media.includes('video'));

            post.images = images;
            post.videos = videos;
        }

        await PostRepo.save(post);

        return res.status(200).json({
            message: 'Post created successfully.',
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
 * /post:
 *    post:
 *      summary: Create a new post
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        description: Content and media files for the post
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                content:
 *                  type: string
 *                  description: The content of the post
 *                media:
 *                  type: array
 *                  items:
 *                    type: string
 *                    format: binary
 *      tags:
 *        - Post
 *      responses:
 *        "200":
 *          description: Post created successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Post created successfully.
 *                          post:
 *                              $ref: '#/components/schemas/Post'
 *        "400":
 *          description: Validation error for post content
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
