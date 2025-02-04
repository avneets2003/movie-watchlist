import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/navbar';
import HomePage from './pages/home';
import WatchlistPage from './pages/watchlist';
import WatchedPage from './pages/watched';
import LoginRegisterPage from './pages/auth';
import { Navigate } from 'react-router-dom';
import './App.css';

const App = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <div>
        <NavigationBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/search" element={<HomePage />} />
            <Route path='/auth' element={<LoginRegisterPage />} />
            <Route 
              path="/watchlist" 
              element={isLoggedIn ? <WatchlistPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/watched" 
              element={isLoggedIn ? <WatchedPage /> : <Navigate to="/" />} 
            />
            <Route path="*" element={isLoggedIn ? <HomePage /> : <LoginRegisterPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
