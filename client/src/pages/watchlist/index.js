import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import WatchlistCard from '../../components/watchlistCard';
import axios from 'axios';
import '../../globalStyles.css';

const WatchlistPage = () => {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const fetchWatchlist = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/watchlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatchlist(response.data);
        };

        fetchWatchlist();
    }, []);

    const handleDelete = async (movieId) => {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/movies/watchlist`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { movieId }
        });
        setWatchlist(watchlist.filter(movie => movie.movieId !== movieId));
        alert("Movie removed from watchlist!");
    };

    const handleMarkWatched = async (movieId) => {
        const token = localStorage.getItem('token');
        
        try {
            await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/movies/watchlist`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { movieId }
                }
            );
            
            try {
                await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/movies/watched`,
                    { movieId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                alert('Movie has been marked as watched!');
            } catch (postError) {
                if (postError.response && postError.response.status === 400) {
                    alert('Movie is already in the watched list!');
                } else {
                    alert('An error occurred while marking the movie as watched.');
                }
            }
            
            setWatchlist(watchlist.filter(movie => movie.movieId !== movieId));
        } catch (error) {
            console.error('Error removing movie from watchlist:', error);
        }
    };

    return (
        <Container className='mb-5'>
            <Row>
                {watchlist.map((movie) => (
                    <Col key={movie._id} lg={3} sm={6} xs={12}>
                        <WatchlistCard
                            movie={movie}
                            onDelete={handleDelete}
                            onMarkWatched={handleMarkWatched}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default WatchlistPage;
