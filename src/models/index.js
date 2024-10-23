import { AppDataSource } from '../data-source.js';
import { User } from './entities/user.js';

export const UserRepo = AppDataSource.getRepository(User);

export { User };
