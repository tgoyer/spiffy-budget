import React from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();

    console.log(user);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return children;
}
