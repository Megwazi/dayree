import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaArrowLeft, FaTimes, FaPlus } from 'react-icons/fa';
import { GiBowTieRibbon } from "react-icons/gi";
import EmojiPicker from 'emoji-picker-react';
import { useDiary } from '../context/DiaryContext';
import { useTheme } from '../context/ThemeContext';

const moods = [
  { name: 'Nenhuma Emoção', emoji: '😊', color: 'pastel-yellow' },
  { name: 'Aborrecimento', emoji: '😊', color: 'pastel-yellow' },
  { name: 'Alegria', emoji: '😢', color: 'pastel-blue' },
  { name: 'Alívio', emoji: '❤️', color: 'kawaii-pink' },
  { name: 'Ansiedade', emoji: '😊', color: 'pastel-yellow' },
  { name: 'Calma', emoji: '😢', color: 'pastel-blue' },
  { name: 'Confiança', emoji: '❤️', color: 'kawaii-pink' },
  { name: 'Constrangimento', emoji: '😠', color: 'pastel-pink' },
  { name: 'Coragem', emoji: '😢', color: 'pastel-blue' },
  { name: 'Culpa', emoji: '❤️', color: 'kawaii-pink' },
  { name: 'Decepção', emoji: '😠', color: 'pastel-pink' },
  { name: 'Desânimo', emoji: '😊', color: 'pastel-yellow' },
  { name: 'Desespero', emoji: '😢', color: 'pastel-blue' },
  { name: 'Desgosto', emoji: '❤️', color: 'kawaii-pink' },
  { name: 'Estresse', emoji: '😊', color: 'pastel-yellow' },

];

const moodColors = {
  'pastel-yellow': 'bg-pastel-yellow',
  'pastel-blue': 'bg-pastel-blue',
  'kawaii-pink': 'bg-kawaii-pink',
};

const NewEntry = () => {
  const navigate = useNavigate();
  const { addEntry } = useDiary();
  const { theme } = useTheme();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const entryData = {
      title,
      content,
      mood,
      tags,
      date: new Date().toISOString()
    };
    
    try {
      const entryId = await addEntry(entryData);
      if (entryId) {
        navigate(`/app/entry/${entryId}`);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/app')}
          className="text-kawaii-pink"
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-5xl brush-font text-kawaii-pink">
        <GiBowTieRibbon className='inline-block mr-2 w-6 h-6 rotate-12'/>
          Novo Registro
        <GiBowTieRibbon className='inline-block ml-2 w-6 h-6 -rotate-12'/>
        </h1>
        <div className="w-6"></div> {/* Empty div for flex spacing */}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Título do Registro..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="kawaii-input w-full text-lg font-semibold"
            required
          />
        </div>
        
        <div className="mb-4">
          <p className={`text-2xl brush-font ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {locale: ptBR})}
          </p>
        </div>
        
        <div className="relative">
          <textarea
            placeholder="O quê tem em mente hoje?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="kawaii-input w-full min-h-[200px] resize-none"
            required
          />
          
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute bottom-3 right-3 text-xl"
          >
            😊
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-12 right-0 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Qual opção melhor se encaixa com o sentimento?</label>
          <div className="flex justify-center">
            <select 
              className={"w-full h-10 flex-grow transition-all kawaii-input"}
            >
              {moods.map((m) => (
                <option key={m.name} value={m.name} className="text-2xl text-left ">
                  {m.emoji} {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Adicionar tag..."
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="kawaii-input flex-grow"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="ml-2 bg-kawaii-pink text-white p-2 rounded-full"
            >
              <FaPlus />
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-pastel-lilac text-gray-700 px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="kawaii-button w-full mt-6"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
        </motion.button>
      </form>
    </div>
  );
};

export default NewEntry;