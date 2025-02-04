import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import WatchedCard from '../../components/watchedCard';
import axios from 'axios';

const WatchedPage = () => {
    const [watchedList, setWatchedList] = useState([]);

    useEffect(() => {
        const fetchWatchedList = async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/watched`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatchedList(response.data);
        };

        fetchWatchedList();
    }, []);

    const handleDelete = async (movieId) => {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/movies/watched`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { movieId }
        });
        setWatchedList(watchedList.filter(movie => movie.movieId !== movieId));
    };

    return (
        <Container className='mb-5'>
            <Row>
                {watchedList.map((movie) => (
                    <Col key={movie.movieId} lg={3} sm={6} xs={12}>
                        <WatchedCard
                            movie={movie}
                            onDelete={handleDelete}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default WatchedPage;
