import React from 'react';
import { Outlet } from '@tanstack/react-router';

function App() {
    return (
        <div className="app-container">
            <h1>Family Budget App</h1>
            <Outlet /> {/* This renders child routes */}
        </div>
    );
}

export default App;
