import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext({});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((type, message) => {
        const id = Date.now();
        setNotifications(prevNotifications => [...prevNotifications, { id, type, message }]);
        setTimeout(() => {
            setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== id));
        }, 3000);
    }, []);

    const value = {
        addNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <div className="notification-container">
                {notifications.map(notification => (
                    <div key={notification.id} className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
