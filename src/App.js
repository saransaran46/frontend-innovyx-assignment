import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory';
import Auth from './components/Auth';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">E-Commerce</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Products</Nav.Link>
                            {isAuthenticated && (
                                <>
                                    <Nav.Link href="/cart">Cart</Nav.Link>
                                    <Nav.Link href="/orders">Orders</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Nav>
                            {isAuthenticated ? (
                                <Nav.Link href="/logout">Logout</Nav.Link>
                            ) : (
                                <>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                    <Nav.Link href="/register">Register</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            
            <Container className="mt-4">
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/cart" element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} />
                    <Route path="/orders" element={isAuthenticated ? <OrderHistory /> : <Navigate to="/login" />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Auth isLogin={true} />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Auth isLogin={false} />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
            </Container>
        </Router>
    );
}

function Logout() {
    React.useEffect(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }, []);
    
    return null;
}

export default App;