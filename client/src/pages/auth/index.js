import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const LoginRegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        document.body.classList.add('page-with-background');
        return () => {
            document.body.classList.remove('page-with-background');
        };
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!username || !password) {
            setError('Username and password are required!');
            return;
        }
    
        setLoading(true);
        const url = isLogin ? `${process.env.REACT_APP_BACKEND_URL}/auth/login` : `${process.env.REACT_APP_BACKEND_URL}/auth/register`;
    
        try {
            const response = await axios.post(url, { username, password });
    
            if (response.data.token) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                alert(isLogin ? 'Logged in successfully!' : 'Registered successfully!');
                navigate('/search');
            } else {
                setError(response.data.message || 'Something went wrong, please try again.');
            }
        } catch (err) {
            setError('Something went wrong, please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card style={{ width: '100%', maxWidth: '400px' }} className='movie-card p-3'>
                <Card.Body>
                    <h2 className="text-center">{isLogin ? 'Login' : 'Register'}</h2>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="primary" type="submit" disabled={loading} style={{ width: '35%' }} className='mt-4 mb-3'>
                                {loading ? 'Submitting...' : isLogin ? 'Login' : 'Register'}
                            </Button>
                        </div>

                        <div className="d-flex justify-content-center">
                            <Button 
                                variant="link" 
                                onClick={() => setIsLogin(!isLogin)}
                                style={{ textAlign: 'center' }}
                            >
                                {isLogin ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginRegisterPage;
