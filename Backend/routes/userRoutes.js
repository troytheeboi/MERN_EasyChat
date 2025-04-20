import express from 'express';
import {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getUserByGoogleId
} from '../controllers/userController.js';

const router = express.Router();

// User routes
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.get('/google/:googleId', getUserByGoogleId);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router; 