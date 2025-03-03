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
      
      toast.success('Bem-vindo(a) ao Dayree!', {
        position: 'top-center',
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Falha ao registrar, tente novamente!', {
        position: 'top-right',
      });
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
        toast.success('Bem-vindo(a) de volta! 🌸', {
          position: 'top-right',
        });
        return true;
      } else {
        toast.error('Email ou senha inválidos!', {
          position: 'top-right',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Falha ao logar, tente novamente!', {
        position: 'top-right',
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      setCurrentUser(null);
      toast.info('Você se desconectou', {
        position: 'top-right',
      });
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao desconectar, tente novamente!', {
        position: 'top-right',
      });
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
      toast.success('Configurações atualizadas! ✨', {
        position: 'top-right',
      });
      return true;
    } catch (error) {
      console.error('Update settings error:', error);
      toast.error('Falha ao atualizar configurações!', {
        position: 'top-right',
      });
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