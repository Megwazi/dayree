import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica o usuário atual
    const getUser = async () => {
      try {
        console.log('Verificando usuário atual...');
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('Erro ao verificar usuário:', error);
          return;
        }
        
        console.log('Usuário encontrado:', user);
        setUser(user)
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Inscreve para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Mudança no estado de autenticação:', { event: _event, session });
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    try {
      console.log('Iniciando registro...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`
        }
      })
      
      if (error) {
        console.error('Erro no registro:', error);
        throw error;
      }
      
      console.log('Registro bem sucedido:', data);
      return data
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  const signIn = async (email, password) => {
    try {
      console.log('Iniciando login...');
      console.log('URL do Supabase:', import.meta.env.VITE_SUPABASE_URL);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Erro no login:', error);
        throw error;
      }
      
      console.log('Login bem sucedido:', data);
      return data
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  const signOut = async () => {
    try {
      console.log('Iniciando logout...');
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Erro no logout:', error);
        throw error;
      }
      
      console.log('Logout bem sucedido');
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}