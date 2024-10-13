import authMiddleware from '../middlewares/auth.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express';
const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
    console.log(req.user);
});

export default router;
