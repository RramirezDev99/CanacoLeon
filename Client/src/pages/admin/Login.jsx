// src/pages/admin/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Ahorita creamos este CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Llamamos a TU API (el endpoint que acabamos de probar)
      const response = await fetch('http://localhost:5286/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
    localStorage.setItem('adminToken', data.token);
    alert("¡Login Exitoso! Token guardado.");
    
    // ANTES DECÍA: navigate('/');
    // CAMBIALO A:
    navigate('/admin'); 
    } else {
        // Error controlado (ej: contraseña mal)
        setError("Credenciales incorrectas. Intenta de nuevo.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Panel Administrativo</h2>
        <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="admin@canaco.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;