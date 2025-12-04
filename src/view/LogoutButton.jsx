import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * LogoutButton.jsx
 *
 * VIEW LAYER - Authentication Component
 *
 * A simple button component that logs the user out and redirects to the home page.
 * Uses the Auth0 React SDK's useAuth0 hook to access authentication methods.
 */
function LogoutButton() {
    const { logout } = useAuth0();

    return (
        <button
            className="logout-button"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin + import.meta.env.BASE_URL } })}
        >
            Log Out
        </button>
    );
}

export default LogoutButton;
