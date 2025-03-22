import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';
import { toast } from 'react-toastify';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('kawaii-pink');
  const [fontFamily, setFontFamily] = useState('rounded');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserSettings = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') throw error;

          if (data) {
            setTheme(data.theme || 'light');
            setPrimaryColor(data.primary_color || 'kawaii-pink');
            setFontFamily(data.font_family || 'rounded');
          } else {
            // Create default settings for new user
            const { error: insertError } = await supabase
              .from('user_settings')
              .insert([{
                user_id: user.id,
                theme: 'light',
                primary_color: 'kawaii-pink',
                font_family: 'rounded'
              }]);

            if (insertError) throw insertError;
          }
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
          toast.error('Falha ao carregar configurações!', {
            position: 'top-right',
          });
        } finally {
          setLoading(false);
        }
      } else {
        // Check system preference for theme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
        }
        setLoading(false);
      }
    };

    loadUserSettings();
  }, [user]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const updateUserSettings = async (settings) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update(settings)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Falha ao atualizar configurações!', {
        position: 'top-right',
      });
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (user) {
      await updateUserSettings({ theme: newTheme });
    }
  };

  const changeColor = async (color) => {
    setPrimaryColor(color);
    if (user) {
      await updateUserSettings({ primary_color: color });
    }
  };

  const changeFont = async (font) => {
    setFontFamily(font);
    if (user) {
      await updateUserSettings({ font_family: font });
    }
  };

  const value = {
    theme,
    primaryColor,
    fontFamily,
    toggleTheme,
    changeColor,
    changeFont,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {!loading && children}
    </ThemeContext.Provider>
  );
};