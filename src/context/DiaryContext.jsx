import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';
import { supabase } from '../config/supabase';

const DiaryContext = createContext();

export const useDiary = () => useContext(DiaryContext);

export const DiaryProvider = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      if (user) {
        try {
          console.log('Carregando registros do usuário:', user.id);
          const { data, error } = await supabase
            .from('entries')
            .select('*, diaries(*)')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Erro ao carregar registros:', error);
            throw error;
          }

          console.log('Registros carregados com sucesso:', data?.length);
          setEntries(data || []);
        } catch (error) {
          console.error('Erro ao carregar registros:', error);
          toast.error('Falha ao carregar registros!', {
            position: 'top-right',
          });
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Nenhum usuário autenticado, limpando registros');
        setEntries([]);
        setLoading(false);
      }
    };

    loadEntries();

    // Só inscreve para atualizações em tempo real se tivermos credenciais válidas
    if (user && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log('Iniciando inscrição para atualizações em tempo real');
      const subscription = supabase
        .channel('entries_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'entries',
            filter: `diary_id=eq.${user?.id}`
          }, 
          (payload) => {
            console.log('Atualização em tempo real recebida:', payload);
            if (payload.eventType === 'INSERT') {
              setEntries(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setEntries(prev => prev.map(entry => 
                entry.id === payload.new.id ? payload.new : entry
              ));
            } else if (payload.eventType === 'DELETE') {
              setEntries(prev => prev.filter(entry => entry.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => {
        console.log('Cancelando inscrição de atualizações em tempo real');
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const addEntry = async (entryData) => {
    try {
      console.log('Adicionando novo registro:', entryData);
      const { data, error } = await supabase
        .from('entries')
        .insert([{
          ...entryData,
          diary_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar registro:', error);
        throw error;
      }
      
      console.log('Registro adicionado com sucesso:', data);
      toast.success('Registro salvo com sucesso! 📝', {
        position: 'top-right',
      });
      return data.id;
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
      toast.error('Falha ao salvar o registro!', {
        position: 'top-right',
      });
      return null;
    }
  };

  const updateEntry = async (id, updatedData) => {
    try {
      console.log('Atualizando registro:', { id, updatedData });
      const { error } = await supabase
        .from('entries')
        .update(updatedData)
        .eq('id', id)
        .eq('diary_id', user.id);

      if (error) {
        console.error('Erro ao atualizar registro:', error);
        throw error;
      }
      
      console.log('Registro atualizado com sucesso');
      toast.success('Registro atualizado com sucesso! ✨', {
        position: 'top-right',
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      toast.error('Falha ao atualizar o registro!', {
        position: 'top-right',
      });
      return false;
    }
  };

  const deleteEntry = async (id) => {
    try {
      console.log('Excluindo registro:', id);
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id)
        .eq('diary_id', user.id);

      if (error) {
        console.error('Erro ao excluir registro:', error);
        throw error;
      }
      
      console.log('Registro excluído com sucesso');
      toast.success('Registro excluído com sucesso! 🗑️', {
        position: 'top-right',
      });
      return true;
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      toast.error('Falha ao excluir o registro!', {
        position: 'top-right',
      });
      return false;
    }
  };

  const getEntry = async (id) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', id)
        .eq('diary_id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
      toast.error('Falha ao buscar registro!', {
        position: 'top-right',
      });
      return null;
    }
  };

  const exportEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('diary_id', user.id);

      if (error) throw error;

      const entriesJson = JSON.stringify(data, null, 2);
      const blob = new Blob([entriesJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `dayree-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Diário exportado com sucesso! 📁', {
        position: 'top-right',
      });
      return true;
    } catch (error) {
      console.error('Erro ao exportar registros:', error);
      toast.error('Falha ao exportar registros!', {
        position: 'top-right',
      });
      return false;
    }
  };

  const value = {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    exportEntries
  };

  return (
    <DiaryContext.Provider value={value}>
      {children}
    </DiaryContext.Provider>
  );
};