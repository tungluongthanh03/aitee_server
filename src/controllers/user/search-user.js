import { UserRepo, BlockRepo } from '../../models/index.js';
import { validateSearchUser } from '../../validators/user.validator.js';

export default async (req, res) => {
    try {
        const { error } = validateSearchUser(req.query);
        if (error) {
            return res.status(400).json({
                error: error.details[0].message,
            });
        }

        const query = req.query.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const terms = query.split(' ');

        const queryBuilder = UserRepo.createQueryBuilder('user');
        queryBuilder
            .where('user.username ILIKE :query', { query: `%${query}%` })
            .orWhere('user.firstName ILIKE :query', { query: `%${query}%` })
            .orWhere('user.lastName ILIKE :query', { query: `%${query}%` });

        if (terms.length === 1) {
            queryBuilder.where(
                '(user.firstName ILIKE :term OR user.lastName ILIKE :term OR user.username ILIKE :term)',
                { term: `%${terms[0]}%` },
            );
        } else if (terms.length > 1) {
            queryBuilder.where(
                '(user.firstName ILIKE :firstTerm AND user.lastName ILIKE :secondTerm)',
                {
                    firstTerm: `%${terms[0]}%`,
                    secondTerm: `%${terms[1]}%`,
                },
            );
            queryBuilder.orWhere(
                '(user.firstName ILIKE :secondTerm AND user.lastName ILIKE :firstTerm)',
                {
                    firstTerm: `%${terms[0]}%`,
                    secondTerm: `%${terms[1]}%`,
                },
            );
        }

        queryBuilder
            .leftJoin(
                'Block',
                'block',
                'block.blockerId = user.id AND block.blockedId = :currentUserId',
                { currentUserId: req.user.id },
            )
            .andWhere('block.blockerId IS NULL')
            .andWhere('user.id != :currentUserId', { currentUserId: req.user.id })
            .skip(skip)
            .take(limit)
            .orderBy('user.username', 'ASC');

        let [users, total] = await queryBuilder.getManyAndCount();

        // Omit sensitive information
        users = users.map((user) => ({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
        }));

        // Omit sensitive information
        users = users.map((user) => ({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
        }));

        return res.status(200).json({
            total,
            users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'An internal server error occurred, please try again.',
        });
    }
};

/**
 * @swagger
 * /user/search:
 *   get:
 *     summary: Search for users
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Number of users per page
 *     responses:
 *       "200":
 *         description: A list of users has been retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *       "400":
 *         description: Invalid query parameters.
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
