import { AppDataSource } from '../data-source.js';
import { User } from './entities/user.js';
import { Friend, Request, Block } from './entities/friend.js';
import { ReportUser, ReportPost, ReportUserDetail, ReportPostDetail } from './entities/report.js';
import { Post } from './entities/post.js';
import { React } from './entities/react.js';
import { Comment } from './entities/comment.js';
import { Message } from './entities/message.js';
import { GroupChat } from './entities/groupChat.js';

export const UserRepo = AppDataSource.getRepository(User);
export const FriendRepo = AppDataSource.getRepository(Friend);
export const RequestRepo = AppDataSource.getRepository(Request);
export const BlockRepo = AppDataSource.getRepository(Block);

export const ReportUserRepo = AppDataSource.getRepository(ReportUser);
export const ReportUserDetailRepo = AppDataSource.getRepository(ReportUserDetail);
export const MessageRepo = AppDataSource.getRepository(Message);
export const GroupChatRepo = AppDataSource.getRepository(GroupChat);

export const PostRepo = AppDataSource.getRepository(Post);
export const ReactRepo = AppDataSource.getRepository(React);
export const CommentRepo = AppDataSource.getRepository(Comment);
export const ReportPostRepo = AppDataSource.getRepository(ReportPost);
export const ReportPostDetailRepo = AppDataSource.getRepository(ReportPostDetail);
export { User, Message, GroupChat };
