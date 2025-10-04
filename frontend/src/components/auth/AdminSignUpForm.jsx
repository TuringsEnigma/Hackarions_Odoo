import React, { useState, useEffect } from 'react';
import { fetchCountriesWithCurrency } from '../../services/countryService';

const AdminSignupForm = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', countryCurrency: '',
    });
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch countries list on component mount
    useEffect(() => {
        const loadCountries = async () => {
            const countryList = await fetchCountriesWithCurrency();
            setCountries(countryList);
            setIsLoading(false);
        };
        loadCountries();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement API call to register Admin (role: Admin) and create Company
        console.log('Admin Signup Data:', formData);
    };

    return (
        <div className="form-box">
            <h2>Admin (Company) Signup</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group"><label htmlFor="name">Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /></div>
                <div className="form-group"><label htmlFor="confirmPassword">Confirm Password</label><input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required /></div>
                
                <div className="form-group">
                    <label htmlFor="countryCurrency">Country selection</label>
                    <select id="countryCurrency" name="countryCurrency" value={formData.countryCurrency} onChange={handleChange} disabled={isLoading} required>
                        <option value="">{isLoading ? 'Loading countries...' : 'Select Country (Sets Company Currency)'}</option>
                        {countries.sort((a, b) => a.name.localeCompare(b.name)).map((c, index) => (
                            <option key={index} value={c.currency}>{c.name} ({c.currency})</option>
                        ))}
                    </select>
                </div>
                
                <button type="submit" className="auth-button" disabled={isLoading}>Signup</button>
                
                <div className="link-text">
                    Already have an account? 
                    <a href="#" onClick={(e) => { e.preventDefault(); onToggle(); }}>Sign In</a> 
                </div>
            </form>
        </div>
    );
};

export default AdminSignupForm;