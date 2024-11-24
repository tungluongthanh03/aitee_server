import { AppDataSource } from '../data-source.js';
import { User } from './entities/user.js';
import { Message } from './entities/message.js';
import { GroupChat } from './entities/groupChat.js';

export const UserRepo = AppDataSource.getRepository(User);
export const MessageRepo = AppDataSource.getRepository(Message);
export const GroupChatRepo = AppDataSource.getRepository(GroupChat);

export { User, Message, GroupChat };
