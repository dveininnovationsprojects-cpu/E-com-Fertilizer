import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    // Check if user data exists in localStorage
    const userStr = localStorage.getItem('user');
    
    // If no user is logged in at all, send them to login page
    if (!userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const userData = JSON.parse(userStr);
        
        // FIX: Extracting role correctly based on your backend response
        const role = userData.role || userData.user?.role; 

        // If this route is strictly for admins, and the user is NOT an admin
        if (adminOnly && role !== 'admin') {
            alert("Access Denied: Admin privileges required.");
            return <Navigate to="/" replace />; // Send normal users to home
        }

        // If everything is fine, show the protected component
        return children;
        
    } catch (error) {
        // In case localStorage data is corrupted
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;