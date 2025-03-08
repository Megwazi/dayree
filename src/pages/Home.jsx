import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaSearch, FaCalendarAlt, FaHeart, FaSadTear } from 'react-icons/fa';
import { GiBowTieRibbon } from "react-icons/gi";
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
        <div className="animate-bounce text-5xl"><img src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f380.png'/></div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-5xl brush-font text-kawaii-pink">
        <GiBowTieRibbon className='inline-block mr-2 w-6 h-6 rotate-12'/>
          Diário de {currentUser?.username}
        <GiBowTieRibbon className='inline-block ml-2 w-6 h-6 -rotate-12'/>
        </h1>
        <p className={`text-base brush-font ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
                className={`kawaii-card mb-3 ${entry.mood === 'happy' ? 'border-l-4 border-pastel-yellow space-y-4' : 
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
                  <div className="mr-2 whitespace-nowrap">
                    {entry.mood === 'Nenhuma Emoção' && <span className="text-sm p-2 rounded-full bg-slate-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2753.png'/>Nenhuma Emoção</span>}
                    {entry.mood === 'Aborrecimento' && <span className="text-sm p-2 rounded-full bg-blue-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f613.png'/>Aborrecimento</span>}
                    {entry.mood === 'Alegria' && <span className="text-sm p-2 rounded-full bg-orange-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f642.png'/>Alegria</span>}
                    {entry.mood === 'Alívio' && <span className="text-sm p-2 rounded-full bg-orange-100"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62e-200d-1f4a8.png'/>Alívio</span>}
                    {entry.mood === 'Amor' && <span className="text-sm p-2 rounded-full bg-red-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png'/>Amor</span>}
                    {entry.mood === 'Ansiedade' && <span className="text-sm p-2 rounded-full bg-indigo-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae3.png'/>Ansiedade</span>}
                    {entry.mood === 'Calma' && <span className="text-sm p-2 rounded-full bg-yellow-100"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60c.png'/>Calma</span>}
                    {entry.mood === 'Confiança' && <span className="text-sm p-2 rounded-full bg-orange-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png'/>Confiança</span>}
                    {entry.mood === 'Constrangimento' && <span className="text-sm p-2 rounded-full bg-slate-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae5.png'/>Constrangimento</span>}
                    {entry.mood === 'Coragem' && <span className="text-sm p-2 rounded-full bg-yellow-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60f.png'/>Coragem</span>}
                    {entry.mood === 'Culpa' && <span className="text-sm p-2 rounded-full bg-stone-400"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f615.png'/>Culpa</span>}
                    {entry.mood === 'Decepção' && <span className="text-sm p-2 rounded-full bg-indigo-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae0.png'/>Decepção</span>}
                    {entry.mood === 'Desespero' && <span className="text-sm p-2 rounded-full bg-sky-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f628.png'/>Desespero</span>}
                    {entry.mood === 'Estresse' && <span className="text-sm p-2 rounded-full bg-red-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f912.png'/>Estresse</span>}
                    {entry.mood === 'Felicidade' && <span className="text-sm p-2 rounded-full bg-lime-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f601.png'/>Felicidade</span>}
                    {entry.mood === 'Frustração' && <span className="text-sm p-2 rounded-full bg-amber-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62b.png'/>Frustração</span>}
                    {entry.mood === 'Inveja' && <span className="text-sm p-2 rounded-full bg-fuchsia-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f644.png'/>Inveja</span>}
                    {entry.mood === 'Medo' && <span className="text-sm p-2 rounded-full bg-indigo-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f630.png'/>Medo</span>}
                    {entry.mood === 'Orgulho' && <span className="text-sm p-2 rounded-full bg-green-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f929.png'/>Orgulho</span>}
                    {entry.mood === 'Paixão' && <span className="text-sm p-2 rounded-full bg-pink-200"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60d.png'/>Paixão</span>}
                    {entry.mood === 'Raiva' && <span className="text-sm p-2 rounded-full bg-red-400"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f621.png'/>Raiva</span>}
                    {entry.mood === 'Satisfação' && <span className="text-sm p-2 rounded-full bg-lime-300"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f973.png'/>Satisfação</span>}
                    {entry.mood === 'Sobrecarga' && <span className="text-sm p-2 rounded-full bg-rose-600"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f635-200d-1f4ab.png'/>Sobrecarga</span>}
                    {entry.mood === 'Solidão' && <span className="text-sm p-2 rounded-full bg-violet-400"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f636.png'/>Solidão</span>}
                    {entry.mood === 'Surpresa' && <span className="text-sm p-2 rounded-full bg-green-500"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f631.png'/>Surpresa</span>}
                    {entry.mood === 'Tristeza' && <span className="text-sm p-2 rounded-full bg-sky-600"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62d.png'/>Tristeza</span>}
                    {entry.mood === 'Vergonha' && <span className="text-sm p-2 rounded-full bg-stone-400"><img className='emoji-area-home' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f636-200d-1f32b-fe0f.png'/>Vergonha</span>}
                  </div>
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-sm p-2 rounded-full bg-pastel-lilac text-gray-700"
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