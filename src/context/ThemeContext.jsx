import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth() || {};
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('kawaii-pink');
  const [fontFamily, setFontFamily] = useState('rounded');

  useEffect(() => {
    // Set theme based on user preferences or system preference
    if (currentUser?.settings) {
      setTheme(currentUser.settings.theme || 'light');
      setPrimaryColor(currentUser.settings.primaryColor || 'kawaii-pink');
      setFontFamily(currentUser.settings.fontFamily || 'rounded');
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const changeColor = (color) => {
    setPrimaryColor(color);
  };

  const changeFont = (font) => {
    setFontFamily(font);
  };

  const value = {
    theme,
    primaryColor,
    fontFamily,
    toggleTheme,
    changeColor,
    changeFont
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};