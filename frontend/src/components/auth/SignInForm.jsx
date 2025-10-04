import React, { useState } from 'react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { useNavigate, Link } from 'react-router-dom'; // 🚨 Import Link for navigation
import { signIn } from '../../services/apiService'; // Assuming you implemented the API service

const SignInForm = ({ onToggle }) => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // 🚨 REAL API INTEGRATION (Replace mock logic)
            // Send credentials to Odoo backend via apiService
            const { user } = await signIn(formData.email, formData.password);
            
            // On success: store user data and redirect
            login(user); 
            navigate('/dashboard'); 

        } catch (err) {
            // Handle errors thrown by the API service
            setError(err.message || 'Sign in failed. Check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-box">
            <h2>Sign In Page</h2>
            {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                
                <button type="submit" className="auth-button" disabled={isLoading}>
                    {isLoading ? 'Logging In...' : 'Login'} {/* 👈 Updated button text */}
                </button>
            </form>

            <div className="link-text">
                {/* 🚨 Use React Router Link component */}
                <Link to="/forgot-password">Forgot password?</Link>
            </div>
            
            <div className="link-text">
                Don't have an account? 
                {/* Keep anchor tag with event handler for toggling the form state locally */}
                <a href="#" onClick={(e) => { e.preventDefault(); onToggle(); }}>Signup</a>
            </div>
        </div>
    );
};

export default SignInForm;