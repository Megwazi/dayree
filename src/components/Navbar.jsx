import { NavLink } from 'react-router-dom';
import { FaHome, FaPlus, FaCog } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme } = useTheme();

  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-t-2xl`}>
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center h-16">
          
          {/* Div que define a área do botão de Início */}
          <div className="w-16 flex justify-center">
            <NavLink 
              to="/app" 
              end
              className={({ isActive }) => 
                `flex flex-col items-center ${isActive ? 'text-kawaii-pink' : 'text-gray-500'}`
              }
            >
              <FaHome className="text-2xl" />
              <span className="text-xs">Início</span>
            </NavLink>
          </div>

          {/* Div que define a área do botão Novo Registro */}
          <div className="w-16 flex justify-center relative">
            <NavLink 
              to="/app/new" 
              className={({ isActive }) => 
                `flex flex-col items-center ${isActive ? 'text-kawaii-pink' : 'text-gray-500'}`
              }
            >
              <div className="absolute top-[-10px] bg-kawaii-pink text-white p-3 rounded-full shadow-lg">
                <FaPlus className="text-xl" />
              </div>
              <span className="text-xs mt-8">Novo</span>
            </NavLink>
          </div>

          {/* Div que define a área do botão de Configurações */}
          <div className="w-16 flex justify-center">
            <NavLink 
              to="/app/settings" 
              className={({ isActive }) => 
                `flex flex-col items-center ${isActive ? 'text-kawaii-pink' : 'text-gray-500'}`
              }
            >
              <FaCog className="text-2xl" />
              <span className="text-xs">Configurações</span>
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
