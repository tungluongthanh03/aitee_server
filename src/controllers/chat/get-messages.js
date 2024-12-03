import { MessageRepo } from '../../models/index.js';


export default async (req, res) => {
    const {userId } = req.query;
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token
    const limit = parseInt(req.query.limit) || 20;  // Default to 20 messages
    const offset = parseInt(req.query.offset) || 0; // Default to 0 (most recent messages)
  
    try {
      const messages = await MessageRepo.query(
        `SELECT * FROM (
             SELECT * FROM message 
             WHERE ("sendFrom" = $1 AND "sendToUser" = $2) 
             OR ("sendFrom" = $2 AND "sendToUser" = $1) 
             OR "sendToGroupChat" = $2
             ORDER BY "createdAt" DESC  -- Get the latest messages first
             LIMIT $3 OFFSET $4         -- Apply pagination
         ) subquery
         ORDER BY "createdAt" ASC;     -- Reorder them chronologically`,
        [currentUserId, userId, limit, offset]
    );          
      res.status(200).json({
        success: true,
        messages,
      });  // Return paginated messages to the client
    } catch (error) {
      console.error("Error fetching messages: ", error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  }