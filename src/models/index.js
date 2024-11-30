import { AppDataSource } from '../data-source.js';
import { User } from './entities/user.js';
import { Friend, Request } from './entities/friend.js';
import { Post } from './entities/post.js';
import { React } from './entities/react.js';
import { Comment } from './entities/comment.js';

export const UserRepo = AppDataSource.getRepository(User);
export const FriendRepo = AppDataSource.getRepository(Friend);
export const RequestRepo = AppDataSource.getRepository(Request);

export const PostRepo = AppDataSource.getRepository(Post);
export const ReactRepo = AppDataSource.getRepository(React);
export const CommentRepo = AppDataSource.getRepository(Comment);
