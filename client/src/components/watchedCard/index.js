import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../../globalStyles.css';

const WatchedCard = ({ movie, onDelete }) => {
    const { poster, title, rating, genres, cast, movieId } = movie;

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating / 2);
        const emptyStars = 5 - fullStars;

        return (
            <span>
                {'★'.repeat(fullStars)}{'☆'.repeat(emptyStars)}
            </span>
        );
    };

    return (
        <Card className="mb-3 movie-card">
            <Card.Img variant="top" src={poster} className="card-poster-2" />
            <Card.Body>
                <Card.Title className="card-title">{title}</Card.Title>
                <Card.Text><strong>Rating:</strong> {renderStars(rating)}</Card.Text>
                <Card.Text className="card-genres"><strong>Genres:</strong> {genres.join(', ')}</Card.Text>
                <Card.Text className="card-cast"><strong>Cast:</strong> {cast.join(', ')}</Card.Text>
                <Button variant="danger" onClick={() => onDelete(movieId)}>Delete</Button>
            </Card.Body>
        </Card>
    );
};

export default WatchedCard;
