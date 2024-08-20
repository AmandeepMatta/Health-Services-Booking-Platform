import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';  // Custom CSS for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email, 
        password: password
      })
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');  // Redirect after successful login
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid credentials');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h3 className="text-center text-primary">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-3">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
