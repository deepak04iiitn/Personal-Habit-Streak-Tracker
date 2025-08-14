import express from 'express';
import { signup, signin, logout, deleteAccount, getMe } from '../controllers/auth.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup' , signup);
router.post('/signin' , signin);
router.post('/logout', logout);
router.delete('/delete-profile', verifyUser, deleteAccount);
router.get('/me', verifyUser, getMe);

export default router;