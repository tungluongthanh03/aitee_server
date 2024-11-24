import { storeMessage } from '../chat/index.js'; // Import the function to store messages in the database
import { getFriendList } from '../user/index.js';

const onlineUsers = new Map(); // Map userId -> socketId


// Function to initialize and handle socket connections 
export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection: ', socket.id);
        socket.on('userConnected', ({username, avatar}) => {
            onlineUsers.set(username, socket.id); 
            console.log(`User ${username} connected.`);
        });

        socket.on('getFriendsOnline', async (currentUser) => {
            const friends = await getFriendList(currentUser.id); // Fetch friends from the database
            // const onlineFriends = friends.filter((friendId) => onlineUsers.has(friendId)); // Filter online users
            socket.emit('friendsOnline', friends); // Send the list back to the client
        });

        socket.on('sendMessage', async (message) => {
            try {
                // Save the message in the database
                await storeMessage(message);
                const { username, avatar, sendFrom, sendTo, content } = message; // Extract message details
                const recipientSocketId = onlineUsers.get(sendTo); // Lookup recipient's socket ID
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receivedMessage', { username, avatar, sendFrom, content });
                    console.log(`Message sent to ${sendTo}: ${content}`);
                } else {
                    console.log(`User ${sendTo} is offline.`);
                }
        
                // Optionally, notify the sendFrom about the delivery status
                // socket.emit('messageDeliveryStatus', { recipient, delivered: !!recipientSocketId });
            } catch (error) {
                console.error('Error handling sendMessage:', error);
                // socket.emit('messageError', { error: 'Failed to send message.' });
            }
        });
        
          

        socket.on('disconnect', () => {

            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User ${userId} disconnected.`);
                    break;
                }
            }
        });
    });
};
