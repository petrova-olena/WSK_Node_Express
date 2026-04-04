import catRouter from './routes/cat_router.js';
import express from 'express';
import userRouter from './routes/user_router.js';

const router = express.Router();

// bind base url for all cat routes to catRouter
router.use('/cats', catRouter);
router.use('/users', userRouter);

export default router;
