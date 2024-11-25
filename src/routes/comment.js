import { Router } from 'express';

import { auth, imageUpload, checkAdmin } from '../middlewares/index.js';

import {
    createComment,
    listComment,
    editComment,
    deleteComment,
} from '../controllers/comment/index.js';

const router = Router();

router.post('/create/:postID', auth, createComment);
router.delete('/delete/:commentID', auth, deleteComment);
router.put('/edit/:commentID', auth, editComment);
router.get('/list/:postID', listComment);
export default router;
