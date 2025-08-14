import express from 'express';
import { createHabit, getHabit, getHabits } from '../controllers/habit.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/:id/details', verifyUser, getHabit);

router.get('/my-habits', verifyUser, getHabits);
router.post('/create-new-habit', verifyUser, createHabit);

export default router;