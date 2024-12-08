import {
    UserRepo,
    PostRepo,
    ReportPostRepo,
    ReportPostDetailRepo,
    FriendRepo,
} from '../../models/index.js';

export const reportPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await PostRepo.findOne({
            where: {
                id: postId,
            },
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const reported = await UserRepo.findOne({
            where: {
                posts: { id: post.id },
            },
        });

        if (reported.id === req.user.id) {
            return res.status(400).json({ error: 'You cannot report yourpost.' });
        }

        const friend = await FriendRepo.findOne({
            where: [
                {
                    acceptorId: req.user.id,
                    acceptedId: reported.id,
                },
                {
                    acceptorId: reported.id,
                    acceptedId: req.user.id,
                },
            ],
        });
        if (!friend) {
            return res
                .status(400)
                .json({ error: 'You cannot report a post whose owner is not your friend.' });
        }

        let reportDetail = await ReportPostDetailRepo.findOne({
            where: {
                reporterId: req.user.id,
                postId: post.id,
            },
        });

        if (reportDetail) {
            return res.status(200).json({
                message: 'You reported.',
            });
        }
        reportDetail = await ReportPostDetailRepo.create({
            reporterId: req.user.id,
            postId: post.id,
        });
        await ReportPostDetailRepo.save(reportDetail);

        let report = await ReportPostRepo.findOneBy({ postId: post.id });
        if (report) {
            report.nReport = report.nReport + 1;
            report.reportRate = report.nReport / post.nViews;

            if (report.nReport > 10 && report.reportRate > 0.3) {
                report.canRequestAdmin = true;
            }
        }
        if (!report) {
            report = await ReportPostRepo.create({
                postId: post.id,
            });
        }

        await ReportPostRepo.save(report);
        res.status(200).json({
            message: 'Post reported successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /report/post/{postId}:
 *    post:
 *      summary: Report a post
 *      description: "Report a specific post. Conditions apply: users cannot report their own posts and can only report posts from their friends."
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: postId
 *          in: path
 *          required: true
 *          description: ID of the post being reported.
 *          schema:
 *            type: string
 *      tags:
 *        - Post Reports
 *      responses:
 *        "200":
 *          description: Post reported successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Post reported successfully.
 *        "400":
 *          description: Bad request due to invalid conditions.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    examples:
 *                      selfReport:
 *                        value: "You cannot report your post."
 *                      notFriend:
 *                        value: "You cannot report a post whose owner is not your friend."
 *        "404":
 *          description: Post not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: Post not found.
 *        "500":
 *          description: Internal server error.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: An internal server error occurred, please try again.
 */
