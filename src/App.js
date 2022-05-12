import './App.css';
import { memo, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import NonAdminRoute from './routes/NonAdminRoute'
import AdminRoute from './routes/AdminRoute'

import Cart from './pages/Cart'
import Home from './pages/Home'
import Product from './pages/Product'
import Products from './pages/Products'
import Profile from './pages/Profile'

import AdminLogin from './pages/AdminLogin'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'

function App() {
  const isLogin = useRef(false)

  return (
      <Router>
        <Routes>

          {/* non admin routes */}
          <Route element={<NonAdminRoute />}>
            <Route index path="/" element={<Home />} exact/>
            <Route path="products/:fstRankCategory/:seRankCategory/:thrRankCaterogy" element={<Products />} />
            <Route path="product/:slug" element={<Product />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* admin routes */}
          <Route path="admin/login" element={<AdminLogin isLogin={isLogin} />} />
          <Route path="admin" element={<AdminRoute isLogin={isLogin} />}>
            <Route index element={<AdminOrders />} exact/>
            <Route path="products" element={<AdminProducts />}/>
          </Route>

        </Routes>

      </Router>
  )
}

export default memo(App);
