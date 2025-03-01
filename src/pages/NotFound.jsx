import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-pastel-lilac flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="kawaii-card text-center max-w-sm w-full"
      >
        <div className="mb-6">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl"
          >
            😿
          </motion.div>
        </div>
        
        <h1 className="text-3xl font-kawaii text-kawaii-pink mb-4">Oops!</h1>
        <p className="text-lg mb-6">The page you're looking for can't be found.</p>
        
        <Link to="/" className="kawaii-button inline-block">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;