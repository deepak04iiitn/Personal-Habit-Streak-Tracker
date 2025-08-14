import express from 'express';
import { createHabit, deleteHabit, getHabit, getHabits, getHabitStats, markHabitComplete, updateHabit } from '../controllers/habit.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/:id/mark-complete', verifyUser, markHabitComplete);

router.get('/:id/statistics', verifyUser, getHabitStats);

router.get('/:id/details', verifyUser, getHabit);
router.put('/:id/update', verifyUser, updateHabit);
router.delete('/:id/remove', verifyUser, deleteHabit);

router.get('/my-habits', verifyUser, getHabits);
router.post('/create-new-habit', verifyUser, createHabit);

export default router;