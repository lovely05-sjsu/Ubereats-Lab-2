import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';  // Import API service

const Login = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', { email, password });

      // Save user data (token & user type) in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userEmail", data.userEmail);

      alert('Login successful!');
      console.log(data);
      // Redirect based on user type
      // navigate(`/${data.userType}/${data.userId}`);
      navigate(`/UserDashboard`);
      window.location.reload();
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
