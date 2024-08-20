import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';  // We'll use a custom CSS file to apply additional styles

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">Health Services</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
