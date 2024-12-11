import { UserRepo, ReportUserRepo, ReportUserDetailRepo, FriendRepo } from '../../models/index.js';
import { adminId } from '../../config/index.js';

export const reportUser = async (req, res) => {
    try {
        const reportedId = req.params.reportedId;

        if (reportedId === req.user.id) {
            return res.status(400).json({ error: 'You cannot report yourself.' });
        }

        if (reportedId === adminId) {
            return res.status(400).json({ error: 'You cannot report the admin.' });
        }

        const reported = await UserRepo.findOne({ where: { id: reportedId } });
        if (!reported) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const friend = await FriendRepo.findOne({
            where: [
                {
                    acceptorId: req.user.id,
                    acceptedId: reportedId,
                },
                {
                    acceptorId: reportedId,
                    acceptedId: req.user.id,
                },
            ],
        });
        if (!friend) {
            return res.status(400).json({ error: 'You cannot report people who are not friends.' });
        }

        let reportDetail = await ReportUserDetailRepo.findOne({
            where: {
                reporterId: req.user.id,
                reportedId: reported.id,
            },
        });

        if (reportDetail) {
            return res.status(200).json({
                message: 'You reported.',
            });
        }
        reportDetail = await ReportUserDetailRepo.create({
            reporterId: req.user.id,
            reportedId: reported.id,
        });
        await ReportUserDetailRepo.save(reportDetail);

        const numFriend = await FriendRepo.count({
            where: {
                acceptorId: reported.id,
                acceptedId: reported.id,
            },
        });

        let report = await ReportUserRepo.findOneBy({ reportedId: reportedId });
        if (report) {
            report.nReport = report.nReport + 1;
            report.reportRate = report.nReport / numFriend;

            if (report.nReport > 10 && report.reportRate > 0.3) {
                report.canRequestAdmin = true;
            }
        }
        if (!report) {
            report = await ReportUserRepo.create({
                reportedId: reported.id,
            });
        }

        await ReportUserRepo.save(report);
        res.status(200).json({
            message: 'User reported successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /report/user/{reportedId}:
 *    post:
 *      summary: Report a user
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: reportedId
 *          in: path
 *          required: true
 *          description: ID of the user being reported
 *          schema:
 *            type: string
 *      tags:
 *        - User Reports
 *      responses:
 *        "200":
 *          description: User reported successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: User reported successfully.
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
 *                        value: "You cannot report yourself."
 *                      adminReport:
 *                        value: "You cannot report the admin."
 *                      notFriend:
 *                        value: "You cannot report people who are not friends."
 *        "404":
 *          description: User not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: User not found.
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
