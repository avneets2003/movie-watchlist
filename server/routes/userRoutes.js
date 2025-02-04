import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
import verifyToken from '../middlewares/authMiddleware.js';

router.get('/watchlist', verifyToken, userController.getWatchlist);
router.get('/watched', verifyToken, userController.getWatchedList);

export default router;
