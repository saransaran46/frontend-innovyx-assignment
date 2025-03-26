import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Auth({ isLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isLogin 
            ? 'http://localhost:8000/api/auth/login/' 
            : 'http://localhost:8000/api/auth/register/';
        
        axios.post(url, formData)
            .then(response => {
                if (isLogin) {
                    localStorage.setItem('token', response.data.token);
                    navigate('/');
                } else {
                    alert('Registration successful! Please login.');
                    navigate('/login');
                }
            })
            .catch(error => {
                setError(error.response?.data?.message || 'An error occurred');
            });
    };

    return (
        <Container style={{ maxWidth: '400px' }}>
            <h2 className="my-4">{isLogin ? 'Login' : 'Register'}</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                {!isLogin && (
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                )}
                
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        name="username" 
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                
                <Button variant="primary" type="submit" className="w-100">
                    {isLogin ? 'Login' : 'Register'}
                </Button>
            </Form>
            
            <div className="mt-3 text-center">
                {isLogin ? (
                    <p>Don't have an account? <a href="/register">Register</a></p>
                ) : (
                    <p>Already have an account? <a href="/login">Login</a></p>
                )}
            </div>
        </Container>
    );
}

export default Auth;