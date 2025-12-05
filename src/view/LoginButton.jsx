import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

/**
 * LoginButton.jsx
 *
 * VIEW LAYER - Authentication Component
 *
 * NOW: A Login Form for Supabase Auth.
 * Allows users to sign in via Magic Link.
 */
function LoginButton() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Check your email for the login link!');
        }
        setLoading(false);
    };

    return (
        <div className="login-form">
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending link...' : 'Send Magic Link'}
                </button>
            </form>
            {message && <p className="login-message">{message}</p>}
        </div>
    );
}

export default LoginButton;
