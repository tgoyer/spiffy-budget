import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter, createRootRoute } from '@tanstack/react-router';

import { AuthProvider } from './context/AuthContext.jsx';
import { loginRoute } from './pages/AuthPage.jsx';
import { dashboardRoute } from './pages/Dashboard.jsx';

import App from './App.jsx';

import './index.css';

const root = createRootRoute({ component: App });
const routeTree = root.addChildren([dashboardRoute(root), loginRoute(root)]);
const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>,
);
