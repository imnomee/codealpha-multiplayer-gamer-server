import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { createGame, joinGame } from '../controllers/game.controller.js';

const router = express.Router();

router.post('/create', protect, createGame);
router.post('/join', protect, joinGame);

export default router;
