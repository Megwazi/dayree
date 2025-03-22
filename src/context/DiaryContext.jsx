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
          const { data, error } = await supabase
            .from('entries')
            .select('*, diaries(*)')
            .order('created_at', { ascending: false });

          if (error) throw error;
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
        setEntries([]);
        setLoading(false);
      }
    };

    loadEntries();

    // Inscreve para atualizações em tempo real
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
      subscription.unsubscribe();
    };
  }, [user]);

  const addEntry = async (entryData) => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .insert([{
          ...entryData,
          diary_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
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
      const { error } = await supabase
        .from('entries')
        .update(updatedData)
        .eq('id', id)
        .eq('diary_id', user.id);

      if (error) throw error;
      
      toast.success('Registro atualizado com sucesso! ✨', {
        position: 'top-right',
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      toast.error('Falha ao atualizar registro!', {
        position: 'top-right',
      });
      return false;
    }
  };

  const deleteEntry = async (id) => {
    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id)
        .eq('diary_id', user.id);

      if (error) throw error;
      
      toast.success('Registro deletado com sucesso!', {
        position: 'top-right',
      });
      return true;
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
      toast.error('Falha ao deletar registro!', {
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