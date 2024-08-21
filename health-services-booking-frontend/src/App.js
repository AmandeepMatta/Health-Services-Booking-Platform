import Header from "./components/Header";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Profile from './components/Profile';
import Register from "./components/Register";
import Home from "./components/Home"; // Import the Home component
import Dashboard from './components/Dashboard'; // Add Dashboard import
import Footer from "./components/Footer";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // Check if the token exists
  return token ? children : <Navigate to="/login" />; // Redirect to login if no token
}
function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <div className="container my-5">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Add Home route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard /> {/* Wrap Dashboard with ProtectedRoute */}
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
