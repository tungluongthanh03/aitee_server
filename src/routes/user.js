import express from 'express';
const router = express.Router();

import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/user.js';

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
