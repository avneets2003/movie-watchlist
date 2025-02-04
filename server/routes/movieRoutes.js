import express from 'express';
const router = express.Router();
import movieController from '../controllers/movieController.js';
import verifyToken from '../middlewares/authMiddleware.js';

router.post('/watchlist', verifyToken, movieController.addMovieToWatchlist);
router.post('/watched', verifyToken, movieController.addMovieToWatched);
router.delete('/watchlist', verifyToken, movieController.deleteMovieFromWatchlist);
router.delete('/watched', verifyToken, movieController.deleteMovieFromWatched);

export default router;
