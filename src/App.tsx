import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import UserDashboard from './pages/UserDashboard.tsx';
import './App.css';

const PrivateRoute = ({ children, role }: { children: React.ReactNode; role?: 'admin' | 'user' }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return <>{children}</>;
};

const AppRoutes = () => {
    const { user, loading } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            
            <Route path="/admin" element={
                <PrivateRoute role="admin">
                    <AdminDashboard />
                </PrivateRoute>
            } />
            
            <Route path="/dashboard" element={
                <PrivateRoute role="user">
                    <UserDashboard />
                </PrivateRoute>
            } />

            <Route path="/" element={
                loading ? <div>Loading...</div> : 
                user?.role === 'admin' ? <Navigate to="/admin" /> : 
                user?.role === 'user' ? <Navigate to="/dashboard" /> : 
                <Navigate to="/login" />
            } />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;
