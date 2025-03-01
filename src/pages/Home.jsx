import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaSearch, FaCalendarAlt, FaHeart, FaSadTear } from 'react-icons/fa';
import { useDiary } from '../context/DiaryContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { entries, loading } = useDiary();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  
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
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-bounce text-5xl">🐻</div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-5xl grape-font text-kawaii-pink">
          Diário de {currentUser?.username}
        </h1>
        <p className={`text-base grape-font ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR})}
        </p>
      </div>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Pesquisar no diário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="kawaii-input pl-10 w-full"
        />
      </div>
      
      
      {filteredEntries.length > 0 ? (
      <div className="space-y-8">
          {filteredEntries.map((entry) => (
            <Link key={entry.id} to={`/app/entry/${entry.id}`} className={''}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`kawaii-card ${entry.mood === 'happy' ? 'border-l-4 border-pastel-yellow space-y-4' : 
                  entry.mood === 'sad' ? 'border-l-4 border-pastel-blue' : 
                  entry.mood === 'love' ? 'border-l-4 border-kawaii-pink' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{entry.title}</h2>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                    <FaCalendarAlt className="mr-1" />
                    {format(new Date(entry.createdAt), 'd MMM', {locale: ptBR})}
                  </div>
                </div>
                
                <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {entry.content}
                </p>
                
                <div className="flex items-center">
                  <div className="mr-2">
                    {entry.mood === 'happy' && <span className="text-xl">😊</span>}
                    {entry.mood === 'sad' && <span className="text-xl">😢</span>}
                    {entry.mood === 'love' && <span className="text-xl">❤️</span>}
                    {entry.mood === 'angry' && <span className="text-xl">😠</span>}
                    {!entry.mood && <span className="text-xl">📝</span>}
                  </div>
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 rounded-full bg-pastel-lilac text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="kawaii-card text-center py-10">
          {entries.length === 0 ? (
            <>
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="text-6xl">📝</span>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Seu diário está vazio :(</h3>
              <p className="text-gray-600 mb-6">Adicione seu primeiro registro!</p>
              <Link to="/app/new" className="kawaii-button inline-block">
                Criar registro
              </Link>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="text-6xl">🔍</span>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Registro não encontrado :(</h3>
              <p className="text-gray-600">Tente utilizar outro termo para pesquisar</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;