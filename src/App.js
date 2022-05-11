import './App.css';
import { memo } from 'react';
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

function App() {
  return (
      <Router>
        <Routes>
          {/* non admin routes */}
          <Route element={<NonAdminRoute />}>
            <Route index path="/" element={<Home />} exact/>
            <Route path="/products/:fstRankCategory/:seRankCategory/:thrRankCaterogy" element={<Products />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* admin routes */}
          <Route path="admin" element={<AdminRoute />} exact/>

        </Routes>

      </Router>
  )
}

export default memo(App);
