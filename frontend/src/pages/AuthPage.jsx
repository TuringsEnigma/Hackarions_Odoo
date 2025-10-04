import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AdminSignupForm from '../components/auth/AdminSignUpForm'; 
import SignInForm from '../components/auth/SignInForm'; 
import { useAuthStore } from '../hooks/useAuthStore';

const AuthPage = () => {
    const { user } = useAuthStore();
    const location = useLocation();

    // Determine the initial form based on the URL path
    const [isSignIn, setIsSignIn] = useState(location.pathname === '/login');
    
    // Redirect already logged-in users
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const toggleForm = () => setIsSignIn(prev => !prev); 

    return (
        <div className="auth-container">
            {isSignIn ? (
                <SignInForm onToggle={toggleForm} />
            ) : (
                <AdminSignupForm onToggle={toggleForm} />
            )}
        </div>
    );
};

export default AuthPage;