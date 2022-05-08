import './App.css';
import { memo } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import NavBar from './components/Navbar'
import Footer from './components/Footer'

import Cart from './pages/Cart'
import Home from './pages/Home'
import Product from './pages/Product'
import ProductList from './pages/ProductList'
import Profile from './pages/Profile'

function App() {
  return (
      <Router>
        <NavBar></NavBar>

          <div className="contentContainer">
            <Routes>
                <Route
                  index
                  element={<Home/>}
                />
                <Route
                  path = "profile"
                  element={<Profile/>}
                />
                <Route
                  path = "productList/:fstRankCategory/:seRankCategory/:thrRankCaterogy"
                  element={<ProductList/>}
                />
                <Route
                  path = "product/:slug"
                  element={<Product/>}
                />
                <Route
                  path = "cart"
                  element={<Cart/>}
                />
            </Routes>
          </div>

        <Footer></Footer>
      </Router>
  )
}

export default memo(App);
