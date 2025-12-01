// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/user/login', {
        usernameOrEmail,
        password
      });

      if (res.data.token) {
        login(res.data.token);
        navigate('/employees');
      } else if (res.data.error) {
        setError(res.data.error);
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login error');
    }
  };

  return (
    <div className="form-card">
  <h2>Login</h2>
  {error && <p style={{ color: 'red' }}>{error}</p>}
  <form onSubmit={handleSubmit}>
    <label>Username or Email</label>
    <input
      type="text"
      value={usernameOrEmail}
      onChange={(e) => setUsernameOrEmail(e.target.value)}
      required
    />

    <label>Password</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button type="submit">Login</button>
  </form>
</div>
  );
};

export default Login;