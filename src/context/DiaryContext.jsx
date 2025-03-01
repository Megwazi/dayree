import { createContext, useState, useContext, useEffect } from 'react';
import { nanoid } from 'nanoid';
import localforage from 'localforage';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const DiaryContext = createContext();

export const useDiary = () => useContext(DiaryContext);

export const DiaryProvider = ({ children }) => {
  const { currentUser } = useAuth() || {};
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      if (currentUser) {
        try {
          const savedEntries = await localforage.getItem('kawaii_diary_entries') || [];
          setEntries(savedEntries);
        } catch (error) {
          console.error('Error loading diary entries:', error);
          toast.error('Failed to load your diary entries');
        } finally {
          setLoading(false);
        }
      } else {
        setEntries([]);
        setLoading(false);
      }
    };

    loadEntries();
  }, [currentUser]);

  const addEntry = async (entryData) => {
    try {
      const newEntry = {
        id: nanoid(),
        ...entryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedEntries = [newEntry, ...entries];
      await localforage.setItem('kawaii_diary_entries', updatedEntries);
      setEntries(updatedEntries);
      
      toast.success('Entry saved successfully! 📝');
      return newEntry.id;
    } catch (error) {
      console.error('Error adding entry:', error);
      toast.error('Failed to save your entry');
      return null;
    }
  };

  const updateEntry = async (id, updatedData) => {
    try {
      const entryIndex = entries.findIndex(entry => entry.id === id);
      
      if (entryIndex === -1) {
        toast.error('Entry not found');
        return false;
      }
      
      const updatedEntry = {
        ...entries[entryIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedEntries = [...entries];
      updatedEntries[entryIndex] = updatedEntry;
      
      await localforage.setItem('kawaii_diary_entries', updatedEntries);
      setEntries(updatedEntries);
      
      toast.success('Entry updated successfully! ✨');
      return true;
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error('Failed to update your entry');
      return false;
    }
  };

  const deleteEntry = async (id) => {
    try {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      await localforage.setItem('kawaii_diary_entries', updatedEntries);
      setEntries(updatedEntries);
      
      toast.success('Entry deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete your entry');
      return false;
    }
  };

  const getEntry = (id) => {
    return entries.find(entry => entry.id === id) || null;
  };

  const exportEntries = () => {
    try {
      // Create a JSON blob
      const entriesJson = JSON.stringify(entries, null, 2);
      const blob = new Blob([entriesJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `kawaii-diary-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Diary exported successfully! 📁');
      return true;
    } catch (error) {
      console.error('Error exporting entries:', error);
      toast.error('Failed to export your diary');
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