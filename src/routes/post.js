import { Router } from 'express';

import {
    createPost,
    updatePost,
    deletePost,
    getPost,
    getPosts,
    react,
    getReacts,
} from '../controllers/post/index.js';
import { auth, mediaUpload, checkAdmin } from '../middlewares/index.js';

const router = Router();

// User routes
router.post('/', auth, mediaUpload.array('media', 10), createPost);
router.put('/:id', auth, mediaUpload.array('media', 10), updatePost);
router.delete('/:id', auth, deletePost);
router.get('/:id', auth, getPost);
router.get('/', auth, getPosts);

// React routes
router.post('/:id/react', auth, react);
router.get('/:id/reacts', auth, getReacts);

// Admin routes
router.get('/posts', auth, checkAdmin, getPosts);
router.delete('/:id', auth, checkAdmin, deletePost);

export default router;