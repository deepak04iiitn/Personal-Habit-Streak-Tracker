import express from 'express';
import { createHabit, getHabit, getHabits, markHabitComplete, updateHabit } from '../controllers/habit.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/:id/mark-complete', verifyUser, markHabitComplete);

router.get('/:id/details', verifyUser, getHabit);
router.put('/:id/update', verifyUser, updateHabit);

router.get('/my-habits', verifyUser, getHabits);
router.post('/create-new-habit', verifyUser, createHabit);

export default router;