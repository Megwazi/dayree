import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(true);
  
  useEffect(() => {
    if (currentUser) {
      navigate('/app');
    }
    
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentUser, navigate]);
  
  if (showAnimation) {
    return (
      <div className="flex items-center justify-center h-screen bg-pastel-pink">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-kawaii text-white mb-4 py-5">Dayree</h1>
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="text-6xl">🎀</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-pink to-pastel-lilac flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-kawaii text-white mb-2 drop-shadow-md">Dayree</h1>
        <p className="text-lg text-white">Seu diário coquete pessoal</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="kawaii-card mb-6 flex flex-col items-center">
          <div className="flex space-x-4 mb-6">
            <motion.span 
              className="text-5xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🌸
            </motion.span>
            <motion.span 
              className="text-5xl"
              animate={{ rotate: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
            >
              🐱
            </motion.span>
            <motion.span 
              className="text-5xl"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
            >
              ✨
            </motion.span>
          </div>
          
          <p className="text-lg mb-8">
            Guarde seus pensamentos e memórias de um jeito especial!
          </p>
          
          <div className="space-y-4 w-full">
            <Link to="/login" className="kawaii-button block w-full text-center">
              Login
            </Link>
            <Link to="/register" className="block w-full text-center bg-white text-kawaii-pink font-rounded py-3 px-6 rounded-2xl shadow-kawaii border-2 border-kawaii-pink transition-all duration-300 hover:shadow-kawaii-hover hover:transform hover:scale-105">
              Registrar
            </Link>
          </div>
        </div>
        
        <p className="text-center text-white text-sm">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
      </motion.div>
    </div>
  );
};

export default Welcome;