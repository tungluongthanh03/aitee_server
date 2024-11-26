import { CommentRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const commentID = req.params.commentID;
        const comment = await CommentRepo.findOneBy({ commentID });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.commentOwner != req.user.id) {
            return res.status(403).json({ message: "Can't delete other people's comments " });
        }

        // check if the comment is root
        if (!comment.rootID) {
            if (comment.images) {
                comment.images.forEach(async (image) => {
                    await deleteMedia(image, 'image');
                });
            }

            if (comment.videos) {
                comment.videos.forEach(async (video) => {
                    await deleteMedia(video, 'video');
                });
            }
            await CommentRepo.remove(comment);
            res.status(200).json({
                message: `Comment with ID ${commentID} was deleted successfully.`,
            });
        } else if (comment.rootID) {
            res.status(400).json({
                message: `Comment is not root. Don't delelte.`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /comments/{commentID}:
 *    delete:
 *      summary: Delete a specific comment by its ID
 *      parameters:
 *        - in: path
 *          name: commentID
 *          required: true
 *          schema:
 *            type: integer
 *          description: ID of the comment to be deleted
 *      tags:
 *        - Comments
 *      responses:
 *        "200":
 *          description: Comment deleted successfully
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "Comment with ID 1 was deleted successfully."
 *        "404":
 *          description: Comment not found
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "Comment not found"
 *        "500":
 *          description: Internal server error
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "An internal server error occurred, please try again."
 */
