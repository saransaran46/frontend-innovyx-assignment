import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = () => {
        axios.get('http://localhost:8000/api/cart/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setCart(response.data);
        })
        .catch(error => {
            console.error('Error fetching cart:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        });
    };

    const removeFromCart = (itemId) => {
        axios.delete(`http://localhost:8000/api/cart/remove/${itemId}/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(() => {
            fetchCart();
        })
        .catch(error => {
            console.error('Error removing from cart:', error);
        });
    };

    const placeOrder = () => {
        axios.post('http://localhost:8000/api/orders/place/', {}, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            alert(`Order placed successfully! Order ID: ${response.data.order_id}`);
            navigate('/orders');
        })
        .catch(error => {
            console.error('Error placing order:', error);
            setError('Failed to place order. Please try again.');
        });
    };

    return (
        <Container>
            <h2 className="my-4">Your Cart</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            
            {cart.items.length === 0 ? (
                <Alert variant="info">Your cart is empty</Alert>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.items.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <img 
                                            src={item.image} 
                                            alt={item.product_name} 
                                            style={{ width: '50px', marginRight: '10px' }} 
                                        />
                                        {item.product_name}
                                    </td>
                                    <td>Rs{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>Rs{item.item_total}</td>
                                    <td>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                <td><strong>Rs{cart.total}</strong></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table>
                    
                    <div className="d-flex justify-content-end">
                        <Button variant="success" onClick={placeOrder}>
                            Place Order
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
}

export default Cart;