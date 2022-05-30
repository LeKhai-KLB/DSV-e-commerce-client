import './App.css';
import { memo, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import CustommerRoute from './routes/Custommer'
import AdminRoute from './routes/Admin'

import Cart from './pages/Custommer/Cart'
import Home from './pages/Custommer/Home'
import Product from './pages/Custommer/Product'
import Products from './pages/Custommer/Products'
import Profile from './pages/Custommer/Profile'

import AdminLogin from './pages/Admin/Login'
import AdminOrders from './pages/Admin/Orders'
import AdminProducts from './pages/Admin/Products' 
import AdminProductInfo from './pages/Admin/ProductInfo'

function App() {
  const isLogin = useRef(false)

  return (
      <Router>
        <Routes>

          {/* non admin routes */}
          <Route element={<CustommerRoute />}>
            <Route index path="/" element={<Home />} exact/>
            <Route path="products/:fstRankCategory/:seRankCategory" element={<Products />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* admin routes */}
          <Route path="admin/login" element={<AdminLogin isLogin={isLogin} />} />
          <Route path="admin" element={<AdminRoute isLogin={isLogin} />}>
            <Route index element={<AdminOrders />} exact/>
            <Route path="products" element={<AdminProducts />}/>
            <Route path="products/add_product" element={<AdminProductInfo />}/>
            <Route path="products/edit_product/:id" element={<AdminProductInfo />}/>
          </Route>

        </Routes>

      </Router>
  )
}

export default memo(App);
