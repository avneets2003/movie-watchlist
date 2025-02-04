import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import SearchCard from '../../components/searchCard';
import './styles.css';

const HomePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;

        setLoading(true);

        try {
            const searchResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
                params: {
                    query: searchQuery,
                    api_key: process.env.REACT_APP_TMDB_API_KEY,
                }
            });

            const moviesList = searchResponse.data.results;

            if (moviesList.length === 0) {
                console.log("No movies found");
                setMovies([]);
                return;
            }

            const movieDetailsPromises = moviesList.map(async (movie) => {
                const movieDetailResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                    params: {
                        api_key: process.env.REACT_APP_TMDB_API_KEY,
                    }
                });
                return movieDetailResponse.data;
            });

            const moviesWithDetails = await Promise.all(movieDetailsPromises);
            setMovies(moviesWithDetails);

        } catch (error) {
            console.error("Error fetching movie data: ", error);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mb-5'>
            <div className='banner'>
                <h2 className='heading'>Track films you’ve watched.<br />Save those you want to see.</h2>
                <Form onSubmit={handleSearch} className="mb-3" style={{ width: '100%', maxWidth: '500px' }}>
                    <Row className="justify-content-center">
                        <Col sm={12}>
                            <Form.Control 
                                type="text" 
                                placeholder="Search for movies..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                            />
                        </Col>
                    </Row>
                </Form>
                <Row className="justify-content-center">
                    <Col sm={12} className="d-flex justify-content-center">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
                        </Button>
                    </Col>
                </Row>
            </div>

            {movies.length > 0 ? <h2 className="my-5">Search Results</h2> : null}

            <Row>
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <Col key={movie.id} lg={2} sm={6} xs={12}>
                            <SearchCard 
                                movie={movie} 
                                setAlertMessage={alert}  // Directly using alert function
                            />
                        </Col>
                    ))
                ) : null}
            </Row>
        </div>
    );
};

export default HomePage;
