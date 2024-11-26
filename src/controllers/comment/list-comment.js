import { CommentRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const postID = req.params.postID;
        // const post = await CommentRepo.findOneBy({ postID });

        // if (!post) {
        //     return res.status(404).json({ message: 'Post not found.' });
        // }

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const offset = (page - 1) * limit;

        const [comments, countComments] = await CommentRepo.findAndCount({
            where: { postID },
            order: { createTime: 'DESC' },
            take: limit,
            skip: offset,
        });

        const totalPages = Math.ceil(countComments / limit);

        if (page > totalPages) {
            return res.status(400).json({
                message: 'Requested page exceeds total pages.',
                totalPages,
                currentPage: page,
            });
        }

        res.status(200).json({
            message: 'Friend requests fetched successfully.',
            data: {
                comments,
                countComments,
                totalPages,
                currentPage: page,
            },
        });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
