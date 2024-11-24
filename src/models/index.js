import { AppDataSource } from '../data-source.js';
import { Post, React } from './entities/post.js';
import { User } from './entities/user.js';

export const UserRepo = AppDataSource.getRepository(User);
export const PostRepo = AppDataSource.getRepository(Post);
export const ReactRepo = AppDataSource.getRepository(React);
