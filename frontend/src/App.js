import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import API from './api';
// import Dashboard from './Dashboard';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isLogin, setIsLogin] = useState(true); // toggle between login/signup
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await API.post('/login', { email: formData.email, password: formData.password });
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
      } else {
        const res = await API.post('/signup', formData);
        setMessage(res.data.message);
        setTimeout(() => setIsLogin(true), 1500);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setFormData({ username: '', email: '', password: '' });
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.message}>{message}</p>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { padding: 30, borderRadius: 10, background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: 350, textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: 15 },
  input: { padding: 10, borderRadius: 5, border: '1px solid #ccc', fontSize: 16 },
  button: { padding: 10, borderRadius: 5, border: 'none', background: '#4CAF50', color: '#fff', fontSize: 16, cursor: 'pointer' },
  message: { color: 'red', fontSize: 14 },
  link: { color: '#007BFF', cursor: 'pointer' }
};

export default function RouterWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  );
}
