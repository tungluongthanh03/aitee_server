import { getGroups, storeMessage } from '../chat/index.js'; // Import the function to store messages in the database
import { uploadMedia } from '../cloudinary/index.js';
import { getFriendList } from '../user/index.js';

export const onlineUsers = new Map(); // Map userId -> socketId

// Function to initialize and handle socket connections
export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection: ', socket.id);
        socket.on('userConnected', async ({ id }) => {
            onlineUsers.set(id, socket.id);
            const groups = await getGroups(id);
            groups.forEach((group) => {
                socket.join(group.groupID);
            });
        });

        socket.on("join-group", (groupID) => {
            if (socket.rooms.has(groupID)) {
              console.log(`User ${socket.id} is already in group ${groupID}`);
              return;
            }
            socket.join(groupID);
            console.log(`User ${socket.id} joined group ${groupID}`);
          });

        socket.on('leave-group', (groupID) => {
            socket.leave(groupID);
            console.log(`User ${socket.id} left room ${groupID}`);
        });

        socket.on('getFriendsOnline', async (currentUser) => {
            const friends = await getFriendList(currentUser.id); // Fetch friends from the database
            // const onlineFriends = friends.filter((friendId) => onlineUsers.has(friendId)); // Filter online users
            socket.emit('friendsOnline', friends); // Send the list back to the client
        });

        socket.on('sendMessage', async (message) => {
            try {
                // Save the message in the database
                let { media, ...mes } = message;
                if(media) {
                    media = media.map(media => {
                        return { buffer: media };
                    });
                    const mediaUrls = await Promise.all(media.map((file) => uploadMedia(file)));
    
                    const images = mediaUrls.filter((media) => media.includes('image'));
                    const videos = mediaUrls.filter((media) => media.includes('video'));

                    const senderSocketId = onlineUsers.get(mes.sendFrom); // Lookup sender's socket ID
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('handledMedia', { images, videos });
                    }
                    mes = { ...mes, images, videos };
                }

                let receivedMessage = await storeMessage(mes);
                receivedMessage.createdAt = new Date(receivedMessage.createdAt).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: '2-digit',
                  });

                const { sendToUser, sendToGroupChat } = message;
                if (sendToUser) {
                    const recipientSocketId = onlineUsers.get(sendToUser); // Lookup recipient's socket ID
                    if (recipientSocketId) {
                        io.to(recipientSocketId).emit('receivedMessage', receivedMessage);
                        console.log('send to user: ' + recipientSocketId);
                    } else {
                        console.log(`User ${sendToUser} is offline.`);
                    }
                } else {
                    io.to(sendToGroupChat).emit('receivedMessageGroup', receivedMessage);
                    console.log('emit successfully');
                }

            } catch (error) {
                console.error('Error handling sendMessage:', error);
                // socket.emit('messageError', { error: 'Failed to send message.' });
            }
        });
        socket.on("logout", () => {
            console.log(`User disconnected: ${socket.id}`);
            socket.disconnect(true); // Forcefully disconnect the socket
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
