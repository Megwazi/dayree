import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaSignOutAlt, FaDownload, FaLock, FaUnlock } from 'react-icons/fa';
import { GiBowTieRibbon } from "react-icons/gi";
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDiary } from '../context/DiaryContext';

const colorOptions = [
  { name: 'Pink', value: 'kawaii-pink' },
  { name: 'Blue', value: 'kawaii-blue' },
  { name: 'Purple', value: 'kawaii-purple' },
];

const fontOptions = [
  { name: 'Rounded', value: 'rounded' },
  { name: 'Kawaii', value: 'kawaii' },
];

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateUserSettings } = useAuth();
  const { theme, toggleTheme, primaryColor, changeColor, fontFamily, changeFont } = useTheme();
  const { exportEntries } = useDiary();
  
  const [isPrivateMode, setIsPrivateMode] = useState(currentUser?.settings?.isPrivateMode || false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate('/login');
    }
  };
  
  const handleExport = () => {
    exportEntries();
  };
  
  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    const newSettings = {
      theme,
      primaryColor,
      fontFamily,
      isPrivateMode
    };
    
    await updateUserSettings(newSettings);
    setIsLoading(false);
  };
  
  const togglePrivateMode = () => {
    setIsPrivateMode(!isPrivateMode);
  };
  
  return (
    <div className="p-4">
      <h1 className="text-5xl brush-font text-kawaii-pink mb-6">
        <GiBowTieRibbon className='inline-block mr-2 w-6 h-6 rotate-12'/> 
        Configurações 
        <GiBowTieRibbon className='inline-block ml-2 w-6 h-6 -rotate-12'/>
      </h1>
      
      <div className="space-y-6">
        <motion.div 
          className="kawaii-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Conta</h2>
          
          <div className="mb-4">
            <div className='pb-4'>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sessão iniciada como</p>
            </div>
            <p className="font-medium text-kawaii-pink">{currentUser?.username}</p>
            <p className="text-sm italic text-gray-500">{currentUser?.email}</p>
          </div>
          
          <div className='flex justify-end'>
            <button
              onClick={handleLogout}
              className="flex items-center justify-items-end text-red-500 font-medium"
            >
              <FaSignOutAlt className="mr-2" />
              Sair
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="kawaii-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Aparência</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span>Modo Escuro/Claro</span>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-pastel-lilac'}`}
              >
                {theme === 'dark' ? <FaMoon className="text-yellow-300" /> : <FaSun className="text-yellow-500" />}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="flex text-sm font-medium mb-2">Cor do Tema <FaLock className='pl-1'/></label>
            <div className="flex space-x-2">
              {colorOptions.map((color) => (
                <button 
                  key={color.value}
                  onClick={() => changeColor(color.value)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    primaryColor === color.value ? 'border-black dark:border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value === 'kawaii-pink' ? '#FF9EB5' : 
                                          color.value === 'kawaii-blue' ? '#99CCFF' : 
                                          color.value === 'kawaii-purple' ? '#D8B5FF' : '' }}
                            
                >aa</button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="flex text-sm font-medium mb-2">Estilo de Fonte <FaLock className='pl-1'/></label>
            <div className="flex space-x-2">
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  onClick={() => changeFont(font.value)}
                  className={`px-4 py-2 rounded-xl ${
                    fontFamily === font.value 
                      ? 'bg-kawaii-pink text-white' 
                      : 'bg-gray-100 dark:bg-gray-100'
                  } ${font.value === 'kawaii' ? 'font-kawaii' : 'font-rounded'}`}
                >
                  Aa
                </button>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="kawaii-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Privacidade</h2>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-medium text-left">Modo Privado</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Necessário autenticação para ver registros
              </p>
            </div>
            <button
              onClick={togglePrivateMode}
              className={`p-2 rounded-full ${isPrivateMode ? 'bg-kawaii-pink' : 'bg-gray-200 dark:bg-gray-200'}`}
            >
              {isPrivateMode ? <FaLock className="text-white" /> : <FaUnlock className="text-gray-500" />}
            </button>
          </div>
        </motion.div>
        
        <motion.div 
          className="kawaii-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Dados</h2>
          
          <div className='flex justify-center'>
            <button
              onClick={handleExport}
              className="flex items-center text-kawaii-blue font-medium"
            >
              <FaDownload className="mr-2" />
              Exportar dados
            </button>
          </div>
        </motion.div>
        
        <motion.button
          onClick={handleSaveSettings}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="kawaii-button w-full"
        >
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </motion.button>
      </div>
    </div>
  );
};

export default Settings;