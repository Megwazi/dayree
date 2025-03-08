import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-home'}`}>
      <div className="max-w-md mx-auto pb-20">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
};

export default Layout;