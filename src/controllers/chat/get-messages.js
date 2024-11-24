import { MessageRepo } from '../../models/index.js';


export default async (req, res) => {
    const {userId } = req.query;
    console.log(userId);
    const currentUserId = req.user.id; // Assuming you're getting the current user's ID from a session or token
    const limit = parseInt(req.query.limit) || 20;  // Default to 20 messages
    const offset = parseInt(req.query.offset) || 0; // Default to 0 (most recent messages)
  
    try {
      const messages = await MessageRepo.query(
        `SELECT * FROM message 
         WHERE ("sendFrom" = $1 AND "sendToUser" = $2) 
         OR ("sendFrom" = $2 AND "sendToUser" = $1) 
         ORDER BY "createdAt" DESC 
         LIMIT $3 OFFSET $4`, 
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