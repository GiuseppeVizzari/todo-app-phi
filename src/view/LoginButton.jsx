import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * LoginButton.jsx
 *
 * VIEW LAYER - Authentication Component
 *
 * A simple button component that triggers the Auth0 login flow.
 * Uses the Auth0 React SDK's useAuth0 hook to access authentication methods.
 */
function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    return (
        <button
            className="login-button"
            onClick={() => loginWithRedirect()}
        >
            Log In
        </button>
    );
}

export default LoginButton;
