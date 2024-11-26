import { CommentRepo } from '../../models/index.js';

import { validateCreateComment } from '../../validators/comment.validator.js';
import { uploadMedia } from '../../services/cloudinary/index.js';

export default async (req, res) => {
    try {
        const { error } = validateCreateComment(req.body);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        //check post
        // const id = req.params.postID;
        // const post = await Post.findOneBy({ id });

        // if (!post) {
        //     return res.status(404).json({ message: 'Post not found' });
        // }
        const userID = req.user.id;

        const comment = await CommentRepo.create({
            content: req.body.content,
            postID: req.params.postID,
            rootID: req.params.commentID,
            commentOwner: userID,
        });
        if (req.files) {
            const media = req.files.map((file) => ({
                buffer: file.buffer,
                mimetype: file.mimetype,
            }));

            const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));

            const images = mediaUrls.filter((media) => media.includes('image'));
            const videos = mediaUrls.filter((media) => media.includes('video'));

            comment.images = images;
            comment.videos = videos;
        }
        await CommentRepo.save(comment);

        return res.status(201).json({
            message: 'Comment added successfully',
            comment,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'An internal server error occurred, please try again.',
        });
    }
};

/**
 * @swagger
 * /posts/{postID}/comments:
 *    post:
 *      summary: Add a comment to a specific post
 *      parameters:
 *        - in: path
 *          name: postID
 *          required: true
 *          schema:
 *            type: integer
 *          description: ID of the post to add a comment to
 *      requestBody:
 *        description: Content of the comment to be added
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                content:
 *                  type: string
 *                  description: The content of the comment
 *                  example: "This is a great post!"
 *      tags:
 *        - Comments
 *      responses:
 *        "201":
 *          description: Comment added successfully
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Comment added successfully
 *                          comment:
 *                              type: object
 *                              properties:
 *                                content:
 *                                  type: string
 *                                  example: "This is a great post!"
 *                                postID:
 *                                  type: integer
 *                                  example: 1
 *        "400":
 *          description: Validation error for comment content
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: "Content is required"
 *        "404":
 *          description: Post not found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "Post not found"
 *        "500":
 *          description: Internal server error
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              example: "An internal server error occurred, please try again."
 */
