import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Accordion, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/api/orders/history/', {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setOrders(response.data);
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        });
    }, [navigate]);

    return (
        <Container>
            <h2 className="my-4">Order History</h2>
            
            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <Accordion>
                    {orders.map((order, index) => (
                        <Accordion.Item key={order.order_id} eventKey={index.toString()}>
                            <Accordion.Header>
                                Order #{order.order_id} - ${order.total_amount} - {order.created_at}
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, itemIndex) => (
                                            <tr key={itemIndex}>
                                                <td>{item.product_name}</td>
                                                <td>${item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>${item.item_total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            )}
        </Container>
    );
}

export default OrderHistory;