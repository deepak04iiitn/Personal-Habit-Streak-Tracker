import express from 'express';
import { createHabit, getHabits } from '../controllers/habit.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/my-habits', verifyUser, getHabits);
router.post('/create-new-habit', verifyUser, createHabit);

export default router;