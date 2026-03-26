import { Router } from 'express';
import { createUser, getUsers, getUserById, toggleUserStatus } from '../controllers/user.controller.js';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/:id/toggle-status', toggleUserStatus);

export default router;