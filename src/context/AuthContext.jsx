import { createContext, useState, useContext, useEffect } from 'react';
import localforage from 'localforage';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const user = await localforage.getItem('kawaii_diary_user');
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const register = async (username, email, password) => {
    try {
      // In a real app, this would be an API call
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        createdAt: new Date().toISOString(),
        settings: {
          theme: 'light',
          primaryColor: 'kawaii-pink',
          fontFamily: 'rounded',
          isPrivateMode: false
        }
      };
      
      await localforage.setItem('kawaii_diary_user', newUser);
      setCurrentUser(newUser);
      
      // Initialize empty diary entries
      await localforage.setItem('kawaii_diary_entries', []);
      
      toast.success('Welcome to Kawaii Diary! 🎉');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      // In a real app, this would validate against a database
      // For demo purposes, we'll just check if the user exists
      const user = await localforage.getItem('kawaii_diary_user');
      
      if (user && user.email === email) {
        setCurrentUser(user);
        toast.success('Welcome back! 🌸');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      toast.info('You have been logged out');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
      return false;
    }
  };

  const updateUserSettings = async (newSettings) => {
    try {
      const updatedUser = {
        ...currentUser,
        settings: {
          ...currentUser.settings,
          ...newSettings
        }
      };
      
      await localforage.setItem('kawaii_diary_user', updatedUser);
      setCurrentUser(updatedUser);
      toast.success('Settings updated successfully! ✨');
      return true;
    } catch (error) {
      console.error('Update settings error:', error);
      toast.error('Failed to update settings');
      return false;
    }
  };

  const value = {
    currentUser,
    register,
    login,
    logout,
    updateUserSettings,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};