import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import './Dashboard.css';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAsRead, updateSubscriptions } = useNotifications();
    const [selectedCategories, setSelectedCategories] = useState<string[]>(user?.subscriptions || []);

    const categories = ['System', 'Task', 'Announcement', 'Update'];

    const handleSubscriptionChange = (category: string) => {
        const newSubs = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newSubs);
    };

    const handleSaveSubscriptions = async () => {
        try {
            await updateSubscriptions(selectedCategories);
            alert('Subscriptions updated!');
        } catch (err) {
            alert('Failed to update subscriptions');
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>User Dashboard</h1>
                    <div className="user-info">
                        <div className="notif-badge">
                            🔔 <span className="count">{unreadCount}</span>
                        </div>
                        <span>Welcome, {user?.username}</span>
                        <button onClick={logout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </header>

            <main className="dashboard-main grid">
                <section className="subscription-card">
                    <h2>Your Subscriptions</h2>
                    <p>Select the topics you want to receive alerts for:</p>
                    <div className="category-list">
                        {categories.map(cat => (
                            <label key={cat} className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={selectedCategories.includes(cat)} 
                                    onChange={() => handleSubscriptionChange(cat)} 
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                    <button onClick={handleSaveSubscriptions} className="save-btn">Save Preferences</button>
                </section>

                <section className="notification-feed">
                    <h2>Live Notification Feed</h2>
                    <div className="feed-container">
                        {notifications.length === 0 ? (
                            <p className="empty-msg">No notifications yet. Subscribe to categories to see updates!</p>
                        ) : (
                            notifications.map(n => (
                                <div key={n._id} className={`notif-item ${user && n.readBy.includes(user._id) ? 'read' : 'unread'}`}>
                                    <div className="notif-header">
                                        <span className="type-tag">{n.type}</span>
                                        <span className="timestamp">{new Date(n.timestamp).toLocaleString()}</span>
                                    </div>
                                    <h3>{n.title}</h3>
                                    <p>{n.message}</p>
                                    {user && !n.readBy.includes(user._id) && (
                                        <button onClick={() => markAsRead(n._id)} className="read-btn">Mark as Read</button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default UserDashboard;
