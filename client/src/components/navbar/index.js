import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand>
                    <img
                        alt="Logo"
                        src={process.env.PUBLIC_URL + '/logo.png'}
                        height="50"
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Nav>
                    {isLoggedIn ? (
                        <>
                            <Nav.Link onClick={() => navigate('/search')}>Search</Nav.Link>
                            <Nav.Link onClick={() => navigate('/watchlist')}>Watchlist</Nav.Link>
                            <Nav.Link onClick={() => navigate('/watched')}>Watched</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </>
                    ) : (
                        <Nav.Link onClick={() => navigate('/auth')}>Login / Register</Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;
