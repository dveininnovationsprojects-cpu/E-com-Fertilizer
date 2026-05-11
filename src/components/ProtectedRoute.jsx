import React from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // 👈 1. Idhai mela import pannunga

const ProtectedRoute = ({ children, adminOnly = false }) => {
   
    const userStr = localStorage.getItem('user');

    if (!userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const userData = JSON.parse(userStr);
        
   
        const role = userData.role || userData.user?.role; 

      
        if (adminOnly && role !== 'admin') {
         
            setTimeout(() => toast.error("Access Denied: Admin privileges required."), 10);
            
            return <Navigate to="/" replace />;
        }

       
        return children;
        
    } catch (error) {
        
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;