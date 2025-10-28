import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { createRoute } from '@tanstack/react-router';

import { login, register as registerUser } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const loginRoute = (root) =>
    createRoute({
        getParentRoute: () => root,
        path: 'login',
        component: () => <AuthPage />,
    });

function AuthPage() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [familyId, setFamilyId] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate({ to: '/' });
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (mode === 'login') {
                const loggedInUser = await login({ email, password });
                setUser(loggedInUser);
                navigate({ to: '/' });
            } else {
                if (password !== confirm) {
                    alert('Passwords do not match');
                    return;
                }
                if (isNaN(Number(familyId))) {
                    alert('Family ID must be a number');
                    return;
                }
                const createdUser = await registerUser({ email, name, familyId: Number(familyId), password });
                setUser(createdUser);
                navigate({ to: '/' });
            }
        } catch (err) {
            alert(mode === 'login' ? 'Login failed' : 'Account creation failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>

            {mode === 'register' && (
                <>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Family ID"
                        value={familyId}
                        onChange={(e) => setFamilyId(e.target.value)}
                        required
                    />
                </>
            )}

            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {mode === 'register' && (
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
            )}

            <button type="submit">{mode === 'login' ? 'Login' : 'Create Account'}</button>

            <div style={{ marginTop: '1rem' }}>
                {mode === 'login' ? (
                    <span>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => setMode('register')}
                            style={{ background: 'none', color: 'blue', cursor: 'pointer', border: 'none', padding: 0 }}
                        >
                            Create Account
                        </button>
                    </span>
                ) : (
                    <span>
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => setMode('login')}
                            style={{ background: 'none', color: 'blue', cursor: 'pointer', border: 'none', padding: 0 }}
                        >
                            Login
                        </button>
                    </span>
                )}
            </div>
        </form>
    );
}
