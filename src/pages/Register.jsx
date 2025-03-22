import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { supabase } from '../config/supabase';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
      toast.error('Preencha todos os campos!');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Senhas não coincidem!');
      return;
    }
    
    if (password.length < 6) {
      toast.error('A senha deve ter ao menos 6 caracteres!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Iniciando registro do usuário...');
      
      // Registra o usuário com email e senha
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });
      
      console.log('Resposta do registro:', { authData, authError });
      
      if (authError) {
        console.error('Erro no registro:', authError);
        throw authError;
      }
      
      if (authData?.user) {
        console.log('Usuário criado:', authData.user);
        
        // Cria o perfil do usuário
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              user_id: authData.user.id,
              username: username,
              email: email,
              theme: 'light',
              primary_color: 'kawaii-pink',
              font_family: 'rounded'
            }
          ])
          .select()
          .single();
        
        console.log('Resposta da criação do perfil:', { profileData, profileError });
        
        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          // Não vamos lançar o erro aqui, apenas logar
        }
        
        toast.success(
          'Conta criada com sucesso! Por favor, verifique seu email para confirmar o registro.',
          { autoClose: 10000 } // Mantém a mensagem por 10 segundos
        );
        navigate('/login');
      } else {
        throw new Error('Não foi possível criar a conta. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error(
        error.message === 'User already registered'
          ? 'Este email já está registrado!'
          : error.message || 'Falha ao criar uma conta, tente novamente!'
      );
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
          <h1 className="text-3xl text-kawaii-pink mb-6">Junte-se ao Dayree!</h1>
          
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-5xl"><img src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f380.png'/></span>
            </motion.div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                Nome de Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="kawaii-input pl-10 w-full"
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
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
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
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
            
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="kawaii-input pl-10 w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="kawaii-button w-full flex justify-center items-center"
            >
              {isLoading ? (
                <span className="animate-pulse">Criando Conta...</span>
              ) : (
                'Registrar-se'
              )}
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já possui uma conta?{' '}
                <Link to="/login" className="text-kawaii-pink font-medium underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;