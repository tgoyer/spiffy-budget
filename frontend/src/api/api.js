const API_URL = import.meta.env.VITE_API_URL;

export async function register({ email, password, name, familyId }) {
    const res = await fetch(`${API_URL}/user`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, familyId }),
    });

    if (!res.ok) throw new Error('Registration failed');
    return res.json();
}

export async function getMe() {
    const res = await fetch(`${API_URL}/user/me`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
}

export async function getTransactions() {
    const res = await fetch(`${API_URL}/transactions`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
}

export async function login({ email, password }) {
    const res = await fetch(`${API_URL}/session`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
}

export async function logout() {
    const res = await fetch(`${API_URL}/session`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Logout failed');
    return res.json();
}
