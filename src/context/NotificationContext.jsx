import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { requestForToken, onMessageListener } from '../firebase';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/notifications', config);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const setupNotifications = async () => {
    if (!user) return;
    
    // Request permission and get token
    const token = await requestForToken();
    if (token) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.post('/api/notifications/token', { fcmToken: token }, config);
      } catch (err) {
        console.error('Failed to save FCM token', err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Handle foreground messages
  useEffect(() => {
    if (user) {
      const listen = async () => {
        try {
          const payload = await onMessageListener();
          if (payload) {
            // Re-fetch notifications when a new one arrives in foreground
            fetchNotifications();
            // Alternatively, show a toast here
            alert(`New Notification: ${payload.notification?.title} - ${payload.notification?.body}`);
          }
          listen();
        } catch (err) {
          console.warn('Foreground message listener error', err);
        }
      };
      listen();
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/notifications/${id}/read`, {}, config);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/notifications/read-all`, {}, config);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
