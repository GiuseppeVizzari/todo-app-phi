import React from 'react';
import { supabase } from '../supabaseClient';
// import LogoutButton from './LogoutButton.jsx'; // Inlined for simplicity

/**
 * UserProfile.jsx
 *
 * VIEW LAYER - Authentication Component
 *
 * Displays the authenticated user's profile information.
 * - Shows Email from Supabase session
 * - Handles Logout
 */
function UserProfile({ session }) {
    const user = session?.user;

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="user-profile">
            <div className="user-info">
                {/* Supabase user object has email but no picture by default unless metadata */}
                <div className="user-details">
                    <p className="user-email">{user?.email}</p>
                </div>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
}

export default UserProfile;
