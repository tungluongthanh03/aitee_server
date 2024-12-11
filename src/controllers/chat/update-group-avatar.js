import { io } from '../../index.js';
import { GroupChatRepo, UserRepo } from '../../models/index.js';
import { uploadMedia, deleteMedia } from '../../services/cloudinary/index.js'; // Make sure deleteMedia is imported if you plan to remove old avatar
import { onlineUsers } from '../../services/socket/index.js';

export default async (req, res) => {
    let { groupID } = req.body;
    let media = req.files; // Assuming this is an array of files (avatars)
    const currentUserId = req.user.id; // Current user ID from the session/token
    console.log(groupID, media);

    try {
        // Check if the group exists
        const group = await GroupChatRepo.findOne({ where: { groupID }, relations: ['has'] });
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found',
            });
        }

        // Check if the current user is a member of the group
        const isMember = group.has.some((user) => user.id === currentUserId);
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: 'You are not a member of this group',
            });
        }

        // Save uploaded image path in user profile if image is provided
        if (req.file) {
            if (group.avatar) {
                await deleteMedia(group.avatar);
            }

            const photoUrl = await uploadMedia(req.file);
            group.avatar = photoUrl;
        }

        // Save the group with the updated avatar
        const savedGroupChat = await GroupChatRepo.save(group);

        // Return a success response with the updated group
        res.status(200).json({
            success: true,
            groupChat: savedGroupChat,
        });

        // Notify all users in the group about the avatar update via socket
        savedGroupChat.has.forEach((user) => {
            const userSocket = onlineUsers.get(user.id);
            if (userSocket) {
                io.to(userSocket).emit('update-group-avatar', savedGroupChat); // Notify each user
            }
        });
    } catch (error) {
        console.error('Error updating avatar: ', error);
        res.status(500).json({
            success: false,
            message: 'Error updating avatar',
            error,
        });
    }
};
