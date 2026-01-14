import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Dashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('System');
    const [loading, setLoading] = useState(false);

    const categories = ['System', 'Task', 'Announcement', 'Update'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/notifications', { title, message, type });
            alert('Notification sent successfully!');
            setTitle('');
            setMessage('');
        } catch (err) {
            alert('Failed to send notification');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Admin Control Panel</h1>
                    <div className="user-info">
                        <span>Welcome, {user?.username}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="admin-form-card">
                    <h2>Send New Notification</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                placeholder="Notification Title" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                placeholder="Type your message here..." 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Broadcast Notification'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
