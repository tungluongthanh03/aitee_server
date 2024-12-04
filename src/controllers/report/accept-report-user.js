import { ReportUserRepo, UserRepo, ReportUserDetailRepo } from '../../models/index.js';

export const acceptReportUser = async (req, res) => {
    try {
        const reportId = req.params.reportId;

        const report = await ReportUserRepo.findOneBy({ id: reportId });
        if (!report) {
            return res.status(404).json({ error: 'Report not found.' });
        }
        const userId = report.reportedId;
        await ReportUserDetailRepo.delete({ reported: userId });
        await UserRepo.delete({ id: userId });
        await ReportUserRepo.delete({ id: reportId });

        return res.status(200).json({ message: 'The report has been processed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /report/accept-report-user/{reportId}:
 *    delete:
 *      summary: Accept and process a user report
 *      description: Processes a reported user by deleting the user, related report details, and the report itself.
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: reportId
 *          in: path
 *          required: true
 *          description: ID of the user report to be processed.
 *          schema:
 *            type: string
 *      tags:
 *        - User Reports
 *      responses:
 *        "200":
 *          description: The report has been processed successfully.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: The report has been processed.
 *        "404":
 *          description: Report not found.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: Report not found.
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
