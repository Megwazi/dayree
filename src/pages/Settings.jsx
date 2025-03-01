import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaSignOutAlt, FaDownload, FaLock, FaUnlock } from 'react-icons/fa';
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
      <h1 className="text-3xl font-kawaii text-kawaii-pink mb-6">Settings</h1>
      
      <div className="space-y-6">
        <motion.div 
          className="kawaii-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as</p>
            <p className="font-medium">{currentUser?.username}</p>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 font-medium"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </motion.div>
        
        <motion.div 
          className="kawaii-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span>Dark Mode</span>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-pastel-lilac'}`}
              >
                {theme === 'dark' ? <FaMoon className="text-yellow-300" /> : <FaSun className="text-yellow-500" />}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Theme Color</label>
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
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Font Style</label>
            <div className="flex space-x-2">
              {fontOptions.map((font) => (
                <button
                  key={font.value}
                  onClick={() => changeFont(font.value)}
                  className={`px-4 py-2 rounded-xl ${
                    fontFamily === font.value 
                      ? 'bg-kawaii-pink text-white' 
                      : 'bg-gray-100 dark:bg-gray-700'
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
          <h2 className="text-xl font-semibold mb-4">Privacy</h2>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-medium">Private Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Require authentication to view entries
              </p>
            </div>
            <button
              onClick={togglePrivateMode}
              className={`p-2 rounded-full ${isPrivateMode ? 'bg-kawaii-pink' : 'bg-gray-200 dark:bg-gray-700'}`}
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
          <h2 className="text-xl font-semibold mb-4">Data</h2>
          
          <button
            onClick={handleExport}
            className="flex items-center text-kawaii-blue font-medium"
          >
            <FaDownload className="mr-2" />
            Export Diary Entries
          </button>
        </motion.div>
        
        <motion.button
          onClick={handleSaveSettings}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="kawaii-button w-full"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </motion.button>
      </div>
    </div>
  );
};

export default Settings;