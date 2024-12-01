import { Router } from 'express';

import {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPosts,
    react,
    getReacts,
    getPostsByUserId,
} from '../controllers/post/index.js';
import {
    createComment,
    listComment,
    editComment,
    deleteComment,
} from '../controllers/comment/index.js';
import { auth, mediaUpload, checkAdmin } from '../middlewares/index.js';

const router = Router();

// friend routes
router.get('/:userId/posts', auth, getPostsByUserId);

// User routes
router.post('/', auth, mediaUpload.array('media', 10), createPost);
router.put('/:postId', auth, mediaUpload.array('media', 10), updatePost);
router.delete('/:postId', auth, deletePost);
router.get('/posts', auth, getPosts);
router.get('/:postId', auth, getPost);

// React routes
router.post('/:postId/react', auth, react);
router.get('/:postId/reacts', auth, getReacts);

// Comment routes
router.post('/:postId/comment', auth, mediaUpload.array('media', 10), createComment);
router.put('/:postId/comment/:commentId', auth, mediaUpload.array('media', 10), editComment);
router.delete('/:postId/comment/:commentId', auth, deleteComment);
router.get('/:postId/comments', auth, listComment);

// Admin routes
router.delete('/:postId', auth, checkAdmin, deletePost);

export default router;
