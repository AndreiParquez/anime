// Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import img from '../assets/hxh.png';


const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-900">
      <motion.img
        src={img} 
        alt="Loading"
        className="mb-4 h-20"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.div
        className="text-base font-bold text-violet-400 font-custom"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        Loading...
      </motion.div>
    </div>
  );
};

export default Loader;
