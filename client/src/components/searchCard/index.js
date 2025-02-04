import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';

const SearchCard = ({ movie, setAlertMessage }) => {
    const { poster_path, title, vote_average, id } = movie;

    const renderStars = (vote_average) => {
        const fullStars = Math.floor(vote_average / 2.0);
        const emptyStars = 5 - fullStars;

        return (
            <span>
                {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
            </span>
        );
    };

    const placeholderImage = 'https://i.imgur.com/ENk9dzM.png';
    const token = localStorage.getItem('token');

    const checkIfInWatchlist = () => {
        return fetch(`${process.env.REACT_APP_BACKEND_URL}/users/watchlist`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                const movieInWatchlist = data.some(movie => movie.movieId === String(id));
                return movieInWatchlist;
            });
    };

    const checkIfInWatched = () => {
        return fetch(`${process.env.REACT_APP_BACKEND_URL}/users/watched`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                const movieInWatched = data.some(movie => movie.movieId === String(id));
                return movieInWatched;
            });
    };

    const handleAddToWatchlist = () => {
        checkIfInWatchlist().then(isInWatchlist => {
            if (isInWatchlist) {
                setAlertMessage('This movie is already in your watchlist!');
                return;
            }

            fetch(`${process.env.REACT_APP_BACKEND_URL}/movies/watchlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 'movieId': id }),
            })
                .then(response => response.json())
                .then(() => {
                    setAlertMessage('Movie has been added to your watchlist!');
                })
                .catch(error => {
                    setAlertMessage('Error adding movie to watchlist: ' + error);
                });
        });
    };

    const handleAddToWatched = () => {
        checkIfInWatched().then(isInWatched => {
            if (isInWatched) {
                setAlertMessage('This movie is already in your watched list!');
                return;
            }

            fetch(`${process.env.REACT_APP_BACKEND_URL}/movies/watched`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 'movieId': id }),
            })
                .then(response => response.json())
                .then(() => {
                    setAlertMessage('Movie has been marked as watched!');
                })
                .catch(error => {
                    setAlertMessage('Error marking movie as watched: ' + error);
                });
        });
    };

    return (
        <Card className="mb-3 movie-card">
            <Card.Img
                variant="top"
                src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : placeholderImage}
                alt={title}
                className="card-poster-1"
            />
            <Card.Body>
                <Card.Title className="card-title">{title}</Card.Title>
                <Card.Text><strong>Rating:</strong> {renderStars(vote_average)}</Card.Text>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        Add to List
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleAddToWatchlist}>Watchlist</Dropdown.Item>
                        <Dropdown.Item onClick={handleAddToWatched}>Watched</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Body>
        </Card>
    );
};

export default SearchCard;
