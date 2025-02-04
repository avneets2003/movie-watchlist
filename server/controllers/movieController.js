import axios from 'axios';
import User from '../models/User.js';

const fetchMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { api_key: process.env.TMDB_API_KEY }
        });

        const movieData = response.data;

        const creditsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: { api_key: process.env.TMDB_API_KEY }
        });

        const cast = creditsResponse.data.cast.slice(0, 5).map(actor => actor.name);

        return {
            title: movieData.title,
            poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
            rating: movieData.vote_average,
            genres: movieData.genres.map(genre => genre.name),
            cast: cast,
        };
    } catch (error) {
        console.error('Error fetching movie details from TMDB:', error);
        return null;
    }
};

const addMovieToWatchlist = async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findOne({ _id: req.user.userId });

    if (user.watchlist.some(movie => movie.movieId === movieId)) {
        return res.status(400).json({ error: 'Movie already in watchlist' });
    }

    if (user.watched.some(movie => movie.movieId === movieId)) {
        return res.status(400).json({ error: 'Movie in watched list, cannot be added to watchlist' });
    }

    const movieDetails = await fetchMovieDetails(movieId);

    if (!movieDetails) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    const movieWithId = {
        movieId,
        ...movieDetails
    };

    user.watchlist.push(movieWithId);
    await user.save();
    return res.status(200).json({ message: 'Movie added to watchlist' });
};

const addMovieToWatched = async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findOne({ _id: req.user.userId });

    if (user.watched.some(movie => movie.movieId === movieId)) {
        return res.status(400).json({ error: 'Movie already in watched list' });
    }

    if (user.watchlist.some(movie => movie.movieId === movieId)) {
        return res.status(400).json({ error: 'Movie in watchlist, cannot be added to watched list' });
    }

    const movieDetails = await fetchMovieDetails(movieId);

    if (!movieDetails) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    user.watched.push({
        movieId,
        ...movieDetails,
    });

    await user.save();
    return res.status(200).json({ message: 'Movie added to watched list' });
};

const deleteMovieFromWatchlist = async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findOne({ _id: req.user.userId });
    const updatedWatchlist = user.watchlist.filter(movie => movie.movieId !== movieId);

    if (updatedWatchlist.length === user.watchlist.length) {
        return res.status(404).json({ error: 'Movie not found in watchlist' });
    }

    user.watchlist = updatedWatchlist;
    await user.save();
    return res.status(200).json({ message: 'Movie removed from watchlist' });
};

const deleteMovieFromWatched = async (req, res) => {
    const { movieId } = req.body;
    const user = await User.findOne({ _id: req.user.userId });
    const updatedWatchedList = user.watched.filter(movie => movie.movieId !== movieId);

    if (updatedWatchedList.length === user.watched.length) {
        return res.status(404).json({ error: 'Movie not found in watched list' });
    }

    user.watched = updatedWatchedList;
    await user.save();
    return res.status(200).json({ message: 'Movie removed from watched list' });
};

const movieController = { addMovieToWatchlist, addMovieToWatched, deleteMovieFromWatchlist, deleteMovieFromWatched };
export default movieController;
