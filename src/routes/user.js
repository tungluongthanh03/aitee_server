import { Router } from 'express';

import {
    register,
    login,
    refreshToken,
    forgotPassword,
    changePassword,
    editUser,
    getUsers,
    getUser,
    searchUser,
    deleteUser,
    deleteUserById,
} from '../controllers/user/index.js';
import { auth, imageUpload, checkAdmin } from '../middlewares/index.js';

const router = Router();

// Don't require authentication routes
router.post('/', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Require authentication routes
router.post('/forgot-password', auth, forgotPassword);
router.post('/change-password', auth, changePassword);
router.put('/', auth, imageUpload.single('avatar'), editUser);
router.get('/', auth, getUser);
router.get('/search', auth, searchUser);
router.delete('/', auth, deleteUser);

// Admin routes
router.get('/users', auth, checkAdmin, getUsers);
router.delete('/:id', auth, checkAdmin, deleteUserById);

export default router;
