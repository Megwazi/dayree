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
          console.log('Carregando configurações do usuário:', user.id);
          const { data, error } = await supabase
            .from('user_profiles')
            .select('theme, primary_color, font_family')
            .eq('user_id', user.id)
            .single();

          if (error) {
            // Se o erro não for "no rows returned", então é um erro real
            if (error.code !== 'PGRST116') {
              console.error('Erro ao carregar configurações:', error);
              toast.error('Falha ao carregar configurações!', {
                position: 'top-right',
                autoClose: 3000
              });
            } else {
              console.log('Nenhuma configuração encontrada para o usuário');
            }
            return;
          }

          if (data) {
            console.log('Configurações carregadas:', data);
            setTheme(data.theme || 'light');
            setPrimaryColor(data.primary_color || 'kawaii-pink');
            setFontFamily(data.font_family || 'rounded');
          }
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
        }
      } else {
        console.log('Nenhum usuário autenticado, usando tema padrão');
        // Verifica preferência do sistema para o tema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
        }
      }
      setLoading(false);
    };

    loadUserSettings();
  }, [user]);

  useEffect(() => {
    // Aplica o tema ao documento
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const updateTheme = async (newTheme) => {
    if (!user) return;

    try {
      console.log('Atualizando tema para:', newTheme);
      const { error } = await supabase
        .from('user_profiles')
        .update({ theme: newTheme })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar tema:', error);
        throw error;
      }

      console.log('Tema atualizado com sucesso');
      setTheme(newTheme);
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      toast.error('Falha ao atualizar o tema!', {
        position: 'top-right',
      });
    }
  };

  const updatePrimaryColor = async (newColor) => {
    if (!user) return;

    try {
      console.log('Atualizando cor primária para:', newColor);
      const { error } = await supabase
        .from('user_profiles')
        .update({ primary_color: newColor })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar cor primária:', error);
        throw error;
      }

      console.log('Cor primária atualizada com sucesso');
      setPrimaryColor(newColor);
    } catch (error) {
      console.error('Erro ao atualizar cor primária:', error);
      toast.error('Falha ao atualizar a cor!', {
        position: 'top-right',
      });
    }
  };

  const updateFontFamily = async (newFont) => {
    if (!user) return;

    try {
      console.log('Atualizando fonte para:', newFont);
      const { error } = await supabase
        .from('user_profiles')
        .update({ font_family: newFont })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar fonte:', error);
        throw error;
      }

      console.log('Fonte atualizada com sucesso');
      setFontFamily(newFont);
    } catch (error) {
      console.error('Erro ao atualizar fonte:', error);
      toast.error('Falha ao atualizar a fonte!', {
        position: 'top-right',
      });
    }
  };

  const value = {
    theme,
    primaryColor,
    fontFamily,
    updateTheme,
    updatePrimaryColor,
    updateFontFamily,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {!loading && children}
    </ThemeContext.Provider>
  );
};