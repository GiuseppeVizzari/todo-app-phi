import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from './LogoutButton.jsx';

/**
 * UserProfile.jsx
 *
 * VIEW LAYER - Authentication Component
 *
 * Displays the authenticated user's profile information including:
 * - User avatar (if available)
 * - User name
 * - User email
 * - Logout button
 */
function UserProfile() {
    const { user } = useAuth0();

    return (
        <div className="user-profile">
            <div className="user-info">
                {user?.picture && (
                    <img src={user.picture} alt={user?.name} className="user-avatar" />
                )}
                <div className="user-details">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                </div>
            </div>
            <LogoutButton />
        </div>
    );
}

export default UserProfile;
