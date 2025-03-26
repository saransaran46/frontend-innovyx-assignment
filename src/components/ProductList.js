import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProductList() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/api/products/')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const addToCart = (productId) => {
        axios.post('http://localhost:8000/api/cart/add/', {
            product_id: productId,
            quantity: 1
        }, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            alert('Product added to cart!');
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        });
    };

    return (
        <Container>
            <h2 className="my-4">Products</h2>
            <Row>
                {products.map(product => (
                    <Col key={product.id} md={4} className="mb-4">
                        <Card>
                            {product.image && (
                                <Card.Img variant="top" src={product.image} style={{ height: '200px', objectFit: 'cover' }} />
                            )}
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Text>${product.price}</Card.Text>
                                <Button 
                                    variant="primary" 
                                    onClick={() => addToCart(product.id)}
                                >
                                    Add to Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ProductList;