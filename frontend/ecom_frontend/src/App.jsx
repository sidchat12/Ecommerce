import { Route, Routes } from 'react-router-dom';
import AddAddress from './components/AddAddress';
import AddProduct from './components/AddProduct';
import AddReview from './components/AddReview';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrderDetails from './pages/OrderDetails';
import OrderHistory from './pages/OrderHistory';
import ProductListByCategory from './pages/ProductListByCategory';
import ProductPage from './pages/ProductPage';
import SellerProfile from './pages/SellerProfile';
import ShowReviews from './pages/ShowReviews';
import SignupPage from './pages/SignupPage';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/category/:category" element={<ProductListByCategory />} />
        <Route path="/product/:product_id" element={<ProductPage />} />
        <Route path="/seller/:seller_id/addproduct" element={<AddProduct />} />
        <Route path="/user/:user_id/addaddress" element={<AddAddress />} />
        <Route path="/user/:user_id/profile" element={<UserProfile />} />
        <Route path="/seller/:seller_id/profile" element={<SellerProfile />} />
        <Route path="/user/:user_id/:product_id/addreview" element={<AddReview />} />
        <Route path="/user/:user_id/history" element={<OrderHistory />} />
        <Route path="/product/:product_id/reviews" element={<ShowReviews />} />
        <Route path="/user/:user_id/:order_id" element={<OrderDetails />} />
      </Routes>
    </div>
  );
}

export default App;
