import { useEffect, useState } from 'react';
import { getTransactions, logout } from '../api/api.js';
import { createRoute, useNavigate } from '@tanstack/react-router';

import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const dashboardRoute = (root) =>
    createRoute({
        getParentRoute: () => root,
        path: '/',
        component: () => (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    });

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        getTransactions().then(setTransactions).catch(console.error);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null); // Clear auth context
            navigate({ to: '/login' }); // Redirect to login page
        } catch (err) {
            alert('Logout failed');
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <ul>
                {transactions?.map((tx) => (
                    <li key={tx.id}>
                        {tx.description} - ${tx.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
}
