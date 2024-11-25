import { AppDataSource } from '../data-source.js';
import { User } from './entities/user.js';
<<<<<<< HEAD

export const UserRepo = AppDataSource.getRepository(User);

export { User };
=======
import { Comment } from './entities/comment.js';
import { RequestFriend } from './entities/friend_table.js';
// import { comment_videos } from './entities/comment_videos.js';
// import { comment_images } from './entities/comment_images.js';

export const UserRepo = AppDataSource.getRepository(User);
export const CommentRepo = AppDataSource.getRepository(Comment);
export const RequestRepo = AppDataSource.getRepository(RequestFriend);

// export { User, Comment, RequestFriend, comment_images, comment_videos };
export { User, Comment, RequestFriend };
>>>>>>> 2c4d49b (Initial commit)
