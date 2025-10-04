import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        // TODO: Implement API call to your Odoo backend. 
        // This endpoint must handle: 1) generating a random password, 
        // 2) updating the user's record with the new password, and 
        // 3) sending the new temporary password to the user's email.

        try {
            // --- MOCK SUCCESS LOGIC ---
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            
            // 🚨 UPDATED MESSAGE to reflect a TEMPORARY PASSWORD being sent
            setMessage(`If an account exists for ${email}, a temporary unique password has been sent to your email.`);
            setEmail(''); 
            // --- END MOCK ---
        } catch (error) {
            // Handle API errors
            setMessage('Failed to process request. Please check the email address or try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="form-box">
                <h2>Forgot Password</h2>
                <p style={{ textAlign: 'center', fontSize: '0.9em' }}>
                    Enter your email to receive a temporary unique password.
                </p>
                
                {message && (
                    <p 
                        style={{ 
                            color: message.includes('Failed') ? 'red' : 'green', 
                            textAlign: 'center', 
                            padding: '10px 0' 
                        }}
                    >
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? 'Sending Password...' : 'Send Password'}
                    </button>
                </form>

                <div className="link-text">
                    <a href="#" onClick={() => navigate('/login')}>Back to Sign In</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;