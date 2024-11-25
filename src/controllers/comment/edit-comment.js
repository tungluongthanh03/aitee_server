import { CommentRepo } from '../../models/index.js';
import { UserRepo } from '../../models/index.js';

export default async (req, res) => {
    try {
        const commentID = req.params.commentID;
        const comment = await CommentRepo.findOneBy({ commentID });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.id != req.user.id) {
            return res.status(403).json({ message: "Can't edit other people's comments " });
        }

        comment.content = req.body.content;
        await CommentRepo.save(comment);

        res.status(200).json({ message: `Comment with ID ${commentID} was updated successfully.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An internal server error occurred, please try again.' });
    }
};
