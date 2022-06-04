import './App.css';
import { memo, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import CustomerRoute from './routes/Customer'
import AdminRoute from './routes/Admin'

import Cart from './pages/Customer/Cart'
import Home from './pages/Customer/Home'
import Product from './pages/Customer/Product'
import Products from './pages/Customer/Products'
import Profile from './pages/Customer/Profile'

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
          <Route element={<CustomerRoute />}>
            <Route index path="/" element={<Home />}/>
            <Route path="products/:fstRankCategory/:seRankCategory" element={<Products />} />
            <Route path="product/:id" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* admin routes */}
          <Route path="admin/login" element={<AdminLogin isLogin={isLogin} />} />
          <Route path="admin" element={<AdminRoute isLogin={isLogin} />}>
            <Route index element={<AdminOrders />}/>
            <Route path="products" element={<AdminProducts />}/>
            <Route path="products/add_product" element={<AdminProductInfo />}/>
            <Route path="products/edit_product/:id" element={<AdminProductInfo />}/>
          </Route>

        </Routes>

      </Router>
  )
}

export default memo(App);
