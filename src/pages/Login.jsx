import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Preencha todos os campos!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/app');
      }
    } catch (error) {
      setError('Falha ao logar, tente novamente!');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // For demo purposes, let's add a quick login function
  const handleDemoLogin = async () => {
    setEmail('demo@example.com');
    setPassword('password123');
    
    setIsLoading(true);
    
    try {
      const success = await login('demo@example.com', 'password123');
      if (success) {
        navigate('/app');
      }
    } catch (error) {
      setError('Falha para logar, tente novamente!');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-img p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-3 text-left">
          <Link to="/" className="inline-flex items-center text-kawaii-pink">
            <FaArrowLeft className="mr-2" />
            Voltar
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="kawaii-card"
        >
          <h1 className="text-3xl text-kawaii-pink mb-6">Bem-vindo(a) de volta!</h1>
          
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-5xl"><img src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f380.png'/></span>
            </motion.div>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="kawaii-input pl-10 w-full"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="kawaii-input pl-10 w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button type="button" className="text-sm text-kawaii-pink underline">
                Esqueceu a senha?
              </button>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="kawaii-button w-full flex justify-center items-center"
            >
              {isLoading ? (
                <span className="animate-pulse">Carregando...</span>
              ) : (
                'Login'
              )}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Não possui uma conta?{' '}
                <Link to="/register" className="text-kawaii-pink font-medium underline">
                  Registrar
                </Link>
              </p>
            </div>
          </form>
          
          <div className="mt-6">
            <button
              onClick={handleDemoLogin}
              className="w-full py-2 px-4 border border-kawaii-blue rounded-xl text-kawaii-blue bg-white hover:bg-kawaii-blue hover:text-white transition-colors duration-300"
            >
              Entrar como convidado
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;