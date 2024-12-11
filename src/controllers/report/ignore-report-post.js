import { ReportPostRepo } from '../../models/index.js';

export const ignoreReportPost = async (req, res) => {
    try {
        const reportId = req.params.reportId;

        const report = await ReportPostRepo.findOneBy({ id: reportId });
        if (!report) {
            return res.status(404).json({ error: 'Report not found.' });
        }

        report.status = true;
        await ReportPostRepo.save(report);

        return res.status(200).json({ message: 'The report has been processed.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An internal server error occurred, please try again.' });
    }
};

/**
 * @swagger
 * /report/irnore-report-post/{reportId}:
 *    patch:
 *      summary: Ignore a post report
 *      description: Marks a post report as processed without taking further actions.
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - name: reportId
 *          in: path
 *          required: true
 *          description: ID of the post report to be ignored.
 *          schema:
 *            type: string
 *      tags:
 *        - Post Reports
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
