import express from 'express';
import { createHabit } from '../controllers/habit.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create-new-habit', verifyUser, createHabit);

export default router;