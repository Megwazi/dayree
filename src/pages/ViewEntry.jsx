import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaArrowLeft, FaTrash, FaEdit } from 'react-icons/fa';
import { useDiary } from '../context/DiaryContext';
import { useTheme } from '../context/ThemeContext';

const ViewEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEntry, deleteEntry } = useDiary();
  const { theme } = useTheme();
  
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const loadEntry = () => {
      const foundEntry = getEntry(id);
      if (foundEntry) {
        setEntry(foundEntry);
      } else {
        navigate('/app');
      }
      setIsLoading(false);
    };
    
    loadEntry();
  }, [id, getEntry, navigate]);
  
  const handleDelete = async () => {
    const success = await deleteEntry(id);
    if (success) {
      navigate('/app');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-bounce text-5xl"><img src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f380.png'/></div>
      </div>
    );
  }
  
  if (!entry) {
    return (
      <div className="p-4 text-center">
        <p>Registro não encontrado</p>
        <button 
          onClick={() => navigate('/app')}
          className="kawaii-button mt-4"
        >
          Voltar
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/app')}
          className="text-kawaii-pink"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate(`/app/edit/${id}`)}
            className="text-kawaii-blue"
          >
            <FaEdit className="text-xl" />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-400"
          >
            <FaTrash className="text-xl" />
          </button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="kawaii-card mb-6"
      >
        <h1 className="text-2xl font-semibold mb-2">{entry.title}</h1>
        
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          {format(new Date(entry.createdAt), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR})}
        </div>
        
        {entry.mood && (
          <div className="mb-4 flex justify-center items-center">
            <div className='kawaii-input w-fit flex justify-center items-center p-1 rounded-full'>
              <span className="mr-2">
                {entry.mood === 'Nenhuma Emoção' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2753.png'/>}
                {entry.mood === 'Aborrecimento' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f613.png'/>}
                {entry.mood === 'Alegria' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f642.png'/>}
                {entry.mood === 'Alívio' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62e-200d-1f4a8.png'/>}
                {entry.mood === 'Amor' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png'/>}
                {entry.mood === 'Ansiedade' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae3.png'/>}
                {entry.mood === 'Calma' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60c.png'/>}
                {entry.mood === 'Confiança' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png'/>}
                {entry.mood === 'Constrangimento' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae5.png'/>}
                {entry.mood === 'Coragem' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60f.png'/>}
                {entry.mood === 'Culpa' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f615.png'/>}
                {entry.mood === 'Decepção' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae0.png'/>}
                {entry.mood === 'Desespero' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f628.png'/>}
                {entry.mood === 'Estresse' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f912.png'/>}
                {entry.mood === 'Felicidade' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f601.png'/>}
                {entry.mood === 'Frustração' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62b.png'/>}
                {entry.mood === 'Inveja' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f644.png'/>}
                {entry.mood === 'Medo' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f630.png'/>}
                {entry.mood === 'Orgulho' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f929.png'/>}
                {entry.mood === 'Paixão' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60d.png'/>}
                {entry.mood === 'Raiva' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f621.png'/>}
                {entry.mood === 'Satisfação' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f973.png'/>}
                {entry.mood === 'Sobrecarga' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f635-200d-1f4ab.png'/>}
                {entry.mood === 'Solidão' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f636.png'/>}
                {entry.mood === 'Surpresa' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f631.png'/>}
                {entry.mood === 'Tristeza' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f62d.png'/>}
                {entry.mood === 'Vergonha' && <img className='emoji-area' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f636-200d-1f32b-fe0f.png'/>}
              </span>
            <span className="text-sm capitalize pr-1">Sentindo {entry.mood}</span>
            </div>
          </div>
        )}
        
        <div className="text-sm mb-6 whitespace-pre-wrap">
          {entry.content}
        </div>
        
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
      </motion.div>
      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="kawaii-card max-w-sm w-full"
          >
            <h3 className="text-xl font-semibold mb-4">Apagar Registro?</h3>
            <p className="mb-6">Você tem certeza que deseja apagar o registro? Essa ação não pode ser desfeita.</p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl"
              >
                Apagar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ViewEntry;