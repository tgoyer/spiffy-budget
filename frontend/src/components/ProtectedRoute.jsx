import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading === false && user == null) {
            navigate({ to: '/login' }); // redirect to home if not authenticated
        }
    }, [loading, user, navigate]);

    if (loading || !user) return <div>Loading...</div>;

    return <>{children}</>;
}
