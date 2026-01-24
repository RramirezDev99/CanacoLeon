import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Buscamos el token en la caja fuerte del navegador
    const token = localStorage.getItem('adminToken');

    // SI NO HAY TOKEN: Lo mandamos al Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // SI SÍ HAY TOKEN: Lo dejamos pasar a las rutas hijas (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;