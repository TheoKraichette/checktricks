import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import './App.css';

const App = () => {
  const { user, logout } = useContext(AuthContext);

  return (
      <Router>
        <div className='container'>
          <h1>CheckTricks</h1>
          <nav>
            <Link to="/">Accueil</Link>
            {user ? (
            <>
              <Link to="/profile">Profil</Link>
              <button onClick={logout}>Se déconnecter</button>
            </>
            ) : (
            <>
              <Link to="/login">Se connecter</Link>
              <Link to="/register">S'inscrire</Link>
            </>
            )}
          </nav>

          <Routes>
            <Route path="/login" element={user ? <Navigate to="/profile" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/profile" /> : <Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
