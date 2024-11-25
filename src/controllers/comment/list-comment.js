import { CommentRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const postID = req.params.postID;
        const comments = await CommentRepo.find({
            where: { postID },
            order: { createTime: 'DESC' },
        });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this post' });
        }

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
