import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import { LogOut, Moon, Sun, CheckCircle, Bell, X, Check } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">
            <CheckCircle className="h-6 w-6" />
            <span>SmartTask</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 relative">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                  
                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 z-50 max-h-96 flex flex-col overflow-hidden">
                      <div className="p-3 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-white/50 dark:bg-gray-800/50">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                        <div className="flex gap-2">
                          <button onClick={markAllAsRead} className="p-1 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400" title="Mark all as read">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => setShowNotifications(false)} className="p-1 text-gray-500 hover:text-red-600">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">No notifications</div>
                        ) : (
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {notifications.map(notif => (
                              <div 
                                key={notif._id} 
                                onClick={() => markAsRead(notif._id)}
                                className={`p-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notif.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                              >
                                <div className="font-medium text-gray-900 dark:text-white flex justify-between">
                                  <span>{notif.title}</span>
                                  {!notif.read && <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1"></span>}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 mt-1">{notif.body}</div>
                                <div className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleDateString()}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <span className="hidden sm:inline-block font-medium">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
