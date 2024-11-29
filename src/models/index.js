import { AppDataSource } from '../data-source.js';
import { User } from './entities/user.js';
import { RequestFriend } from './entities/friend_table.js';
import { Post } from './entities/post.js';
import { React } from './entities/react.js';
import { Comment } from './entities/comment.js';

export const UserRepo = AppDataSource.getRepository(User);
export const RequestRepo = AppDataSource.getRepository(RequestFriend);

export const PostRepo = AppDataSource.getRepository(Post);
export const ReactRepo = AppDataSource.getRepository(React);
export const CommentRepo = AppDataSource.getRepository(Comment);
