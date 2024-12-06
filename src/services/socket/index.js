import { getGroups, storeMessage } from '../chat/index.js'; // Import the function to store messages in the database
import { getFriendList } from '../user/index.js';

const onlineUsers = new Map(); // Map userId -> socketId

// Function to initialize and handle socket connections
export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection: ', socket.id);
        socket.on('userConnected', async ({ id }) => {
            onlineUsers.set(id, socket.id);
            const groups = await getGroups(id);
            console.log(groups);
            groups.forEach((group) => {
                socket.join(group.groupID);
            });
        });

        socket.on('getFriendsOnline', async (currentUser) => {
            const friends = await getFriendList(currentUser.id); // Fetch friends from the database
            // const onlineFriends = friends.filter((friendId) => onlineUsers.has(friendId)); // Filter online users
            socket.emit('friendsOnline', friends); // Send the list back to the client
        });

        socket.on('sendMessage', async (message) => {
            try {
                // Save the message in the database
                const receivedMessage = await storeMessage(message);
                const { sendToUser, sendToGroupChat, content } = message;

                if (sendToUser) {
                    const recipientSocketId = onlineUsers.get(sendToUser); // Lookup recipient's socket ID
                    if (recipientSocketId) {
                        io.to(recipientSocketId).emit('receivedMessage', receivedMessage);
                        console.log('send to user/groupchat: ' + recipientSocketId);
                    } else {
                        console.log(`User ${sendToUser} is offline.`);
                    }
                } else {
                    io.to(sendToGroupChat).emit('receivedMessageGroup', receivedMessage);
                    console.log('emit successfully');
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
