import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Ahorita lo creamos

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Para cerrar sesión, solo borramos el token
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Panel Canaco</h2>
                <nav>
                    <ul>
                        <li><a href="#">Resumen</a></li>
                        <li><a href="#">📰 Noticias</a></li>
                        <li><a href="#">📅 Eventos</a></li>
                    </ul>
                </nav>
                <button onClick={handleLogout} className="logout-btn">
                    Cerrar Sesión
                </button>
            </aside>

            <main className="content">
                <h1>Bienvenido, Administrador</h1>
                <p>Aquí podrás gestionar el contenido del sitio web.</p>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Noticias Activas</h3>
                        <p>12</p>
                    </div>
                    <div className="stat-card">
                        <h3>Eventos Próximos</h3>
                        <p>5</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;