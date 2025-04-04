import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages OK
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NewEntry from './pages/NewEntry';
import ViewEntry from './pages/ViewEntry';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Components OK
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Context OK
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DiaryProvider } from './context/DiaryContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources OK
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-pastel-pink">
        <div className="text-center">
          <h1 className="text-6xl paws text-white mb-4">Dayree</h1>
          <div className="animate-bounce-slow">
            <img className='flex justify-center mb-6' src='https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f380.png'/>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <DiaryProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Home />} />
                <Route path="new" element={<NewEntry />} />
                <Route path="entry/:id" element={<ViewEntry />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
          <ToastContainer position="bottom-center" theme="colored" />
        </DiaryProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;