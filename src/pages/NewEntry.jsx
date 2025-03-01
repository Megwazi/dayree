import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaArrowLeft, FaTimes, FaPlus } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { useDiary } from '../context/DiaryContext';
import { useTheme } from '../context/ThemeContext';

const moods = [
  { name: 'happy', emoji: '😊', color: 'pastel-yellow' },
  { name: 'sad', emoji: '😢', color: 'pastel-blue' },
  { name: 'love', emoji: '❤️', color: 'kawaii-pink' },
  { name: 'angry', emoji: '😠', color: 'pastel-pink' }
];

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
      console.error('Error saving entry:', error);
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
        <h1 className="text-2xl font-kawaii text-kawaii-pink">New Entry</h1>
        <div className="w-6"></div> {/* Empty div for flex spacing */}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Entry title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="kawaii-input w-full text-lg font-semibold"
            required
          />
        </div>
        
        <div className="mb-4">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        
        <div className="relative">
          <textarea
            placeholder="What's on your mind today?"
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
          <label className="block text-sm font-medium mb-2">How are you feeling?</label>
          <div className="flex justify-between">
            {moods.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => setMood(m.name)}
                className={`p-3 rounded-full transition-all ${
                  mood === m.name 
                    ? `bg-${m.color} scale-110 shadow-lg` 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Add a tag..."
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
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </motion.button>
      </form>
    </div>
  );
};

export default NewEntry;