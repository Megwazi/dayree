import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaSearch } from 'react-icons/fa';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../config/supabase';

const moodEmojis = {
  'Feliz': { emoji: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f601.png', bgColor: 'bg-yellow-100' },
  'Triste': { emoji: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f622.png', bgColor: 'bg-blue-100' },
  'Animado': { emoji: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f929.png', bgColor: 'bg-green-100' },
  'Ansioso': { emoji: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f61f.png', bgColor: 'bg-purple-100' },
  'Calmo': { emoji: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60c.png', bgColor: 'bg-blue-50' },
  'Irritado': { emoji: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f621.png', bgColor: 'bg-red-100' },
  'Apaixonado': { emoji: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60d.png', bgColor: 'bg-pink-100' },
  'Entediado': { emoji: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f644.png', bgColor: 'bg-gray-100' }
};

const Home = () => {
  const { entries, loading } = useDiary();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    if (entries) {
      setFilteredEntries(
        entries.filter(entry => 
          entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.content?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [entries, searchTerm]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();
          
        if (!error && data) {
          setUsername(data.username);
        }
      }
    };
    
    fetchUsername();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-bounce text-5xl">
          <img src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f380.png'/>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl brush-font text-kawaii-pink mb-2">
          Olá, {username || user?.user_metadata?.username || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 capitalize">
          {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>
      
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar no diário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="kawaii-input pl-10 w-full"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {filteredEntries.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((entry) => (
            <Link key={entry.id} to={`/app/entry/${entry.id}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="kawaii-card h-full"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-kawaii text-kawaii-pink mb-2">{entry.title}</h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(entry.created_at), "d 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {entry.content}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {entry.mood && moodEmojis[entry.mood] && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${moodEmojis[entry.mood].bgColor}`}>
                      <img src={moodEmojis[entry.mood].emoji} alt={entry.mood} className="w-4 h-4 mr-1" />
                      {entry.mood}
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center">
          {entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="kawaii-card max-w-md mx-auto"
            >
              <div className="mb-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl"
                >
                  <img src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4d4.png' alt="Diary" className="mx-auto" />
                </motion.div>
              </div>
              <h3 className="text-xl font-kawaii text-kawaii-pink mb-2">
                Seu diário está vazio
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Que tal começar a escrever suas memórias?
              </p>
              <Link
                to="/app/new"
                className="kawaii-button inline-block"
              >
                Criar novo registro
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="kawaii-card max-w-md mx-auto"
            >
              <div className="mb-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl"
                >
                  <img src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f50d.png' alt="Search" className="mx-auto" />
                </motion.div>
              </div>
              <h3 className="text-xl font-kawaii text-kawaii-pink mb-2">
                Nenhum registro encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente usar outras palavras na pesquisa
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;