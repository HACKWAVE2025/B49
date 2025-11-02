import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-b from-[#01010a] via-[#050518] to-[#000000] text-center text-white font-mono">
      
      {/* ✨ Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00bfff] opacity-20 blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff4500] opacity-20 blur-[150px]" />
      <div className="absolute top-1/3 left-1/2 w-48 h-48 bg-[#ffffff] opacity-10 blur-[100px]" />

      {/* 🚀 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-7xl font-bold text-[#00bfff] drop-shadow-[0_0_30px_#00bfff] mb-6"
      >
        SPACE RUNNER 
      </motion.h1>

      {/* 🪐 Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg text-[#a0a0ff] tracking-widest mb-12 max-w-xl"
      >
        Dodge meteors, collect points, and outsmart scam questions as you travel across the galaxy.
      </motion.p>

      {/* ▶️ Start Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/game")}
        className="px-10 py-4 text-2xl font-bold bg-[#00ff88] text-black rounded-2xl shadow-[0_0_25px_#00ff88] hover:shadow-[0_0_40px_#00ff88] transition-all duration-300"
      >
        ▶️ Start Game
      </motion.button>

      {/* 🌌 Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 text-sm text-[#999] tracking-wider"
      >
        © {new Date().getFullYear()} Space Runner by GoodFellas
      </motion.div>

      {/* Neon border line */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#00bfff] via-[#ff4500] to-[#00bfff] blur-sm animate-pulse" />
    </div>
  );
}