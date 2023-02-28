import react from "react";
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from "./componets/Header";
import Footer from "./componets/Footer";
import HomeScreen from "./screens/HomeScreen";
import CartScreen from "./screens/cartScreen";
import ProductScreen from './screens/ProductScreen'
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";


function App() {
    return (
        <Router>
            <Header />
            <main className='py-3'>
                <Container>
                    <Routes>
                        <Route path='/' element={<HomeScreen />} />
                        <Route path='/search/:keyword' element={<HomeScreen />} />
                        <Route path='/page/:pageNumber' element={<HomeScreen />} />
                        <Route path='/register' element={<RegisterScreen />} />
                        <Route path='/login' element={<LoginScreen />} />
                        <Route path='/profile' element={<ProfileScreen />} />
                        <Route path='/admin/userlist' element={<UserListScreen />} />
                        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
                        <Route path='/admin/productlist' element={<ProductListScreen />} />
                        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
                        <Route path='/admin/orderlist' element={<OrderListScreen />} />
                        <Route path='/product/:id' element={<ProductScreen />} />
                        <Route path='/cart/:id?' element={<CartScreen />} />
                        <Route path='/shipping' element={<ShippingScreen />} />
                        <Route path='/payment' element={<PaymentScreen />} />
                        <Route path='/placeorder' element={<PlaceOrderScreen />} />
                        <Route path='/order/:id' element={<OrderScreen />} />
                    </Routes>
                </Container>
            </main>
            <Footer />
        </Router>

    );
}

export default App