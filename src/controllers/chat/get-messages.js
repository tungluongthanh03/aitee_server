import { GroupChatRepo, MessageRepo, UserRepo } from '../../models/index.js';

export default async (req, res) => {
    const { userId } = req.query;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token
    const limit = parseInt(req.query.limit) || 20; // Default to 20 messages
    const offset = parseInt(req.query.offset) || 0; // Default to 0 (most recent messages)

    try {
        let query;
        let parameters = [];
        const group = await GroupChatRepo.findOne({ where: { groupID: userId }, relations: ['has'] });
        const user = await UserRepo.findOne({ where: { id: userId } });

        if(!group && !user) {
            return res.status(404).json({
                success: false,
                message: 'User or group not found',
            });
        }

        if (group) {
            const isMember = group.has.some((user) => user.id === currentUserId);
            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not a member of this group',
                });
            } else {
                query = `SELECT * FROM (
                      SELECT * FROM message 
                      WHERE "sendToGroupChat" = $1
                      ORDER BY "createdAt" DESC  -- Get the latest messages first
                      LIMIT $2 OFFSET $3         -- Apply pagination
                  ) subquery
                  ORDER BY "createdAt" ASC;     -- Reorder them chronologically`;
                  parameters = [userId, limit, offset]
            }
        } else {
            query = `SELECT * FROM (
                      SELECT * FROM message 
                      WHERE ("sendFrom" = $1 AND "sendToUser" = $2)
                      OR ("sendFrom" = $2 AND "sendToUser" = $1)
                      ORDER BY "createdAt" DESC  -- Get the latest messages first
                      LIMIT $3 OFFSET $4         -- Apply pagination
                  ) subquery
                  ORDER BY "createdAt" ASC;     -- Reorder them chronologically`;
            parameters = [currentUserId, userId, limit, offset];
        }

        const messages = await MessageRepo.query(
            query,
            parameters,
        );
        res.status(200).json({
            success: true,
            messages,
        }); // Return paginated messages to the client
    } catch (error) {
        console.error('Error fetching messages: ', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};
