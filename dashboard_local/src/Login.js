import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
  },
  card: {
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    backdropFilter: 'blur(12px)',
    border: '1.5px solid rgba(255,255,255,0.25)',
    padding: '48px 36px 36px 36px',
    width: '370px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    transition: 'box-shadow 0.3s',
  },
  logo: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    marginBottom: '18px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
    background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.2rem',
    color: '#fff',
    fontWeight: 700,
    letterSpacing: '2px',
  },
  title: {
    color: '#fff',
    fontSize: '2.1rem',
    fontWeight: 800,
    marginBottom: '28px',
    letterSpacing: '1.5px',
    textShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: '18px',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#b3c0ce',
    fontSize: '1.1rem',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 38px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(255,255,255,0.18)',
    color: '#fff',
    fontSize: '1.05rem',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'background 0.2s',
    marginBottom: '0',
  },
  button: {
    width: '100%',
    padding: '13px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.15rem',
    cursor: 'pointer',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
    marginTop: '10px',
    marginBottom: '8px',
    letterSpacing: '1px',
    transition: 'background 0.2s, transform 0.2s',
  },
  buttonHover: {
    background: 'linear-gradient(90deg, #0072ff 0%, #00c6ff 100%)',
    transform: 'scale(1.03)',
  },
  error: {
    color: '#ff4d4f',
    marginTop: '8px',
    fontSize: '1rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  welcome: {
    color: '#fff',
    fontSize: '1.3rem',
    fontWeight: 600,
    marginTop: '20px',
    textAlign: 'center',
    textShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
};

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'Knose@14041989';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      setLoggedIn(true);
      setError('');
      setTimeout(() => {
        navigate('/options');
      }, 800);
    } else {
      setError('Invalid username or password.');
      setLoggedIn(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit} autoComplete="off">
        <div style={styles.logo}>
          <span role="img" aria-label="logo">🔒</span>
        </div>
        <div style={styles.title}>Sign in to Dashboard</div>
        <div style={styles.inputWrapper}>
          <span style={styles.inputIcon}>👤</span>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div style={styles.inputWrapper}>
          <span style={styles.inputIcon}>🔑</span>
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button
          style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
          type="submit"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Login
        </button>
        {error && <div style={styles.error}>{error}</div>}
        {loggedIn && <div style={styles.welcome}>Welcome, {username}!</div>}
      </form>
    </div>
  );
} 