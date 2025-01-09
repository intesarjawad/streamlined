'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center">
      {/* Background scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-5" />

      {/* Loading reactor */}
      <div className="relative w-32 h-32">
        {/* Ambient glow */}
        <div className="absolute inset-0 blur-2xl">
          <div className="absolute inset-1/4 bg-neon-blue/40 rounded-full animate-pulse-slow" />
        </div>

        {/* Outer ring */}
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-neon-blue/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          {/* Notches */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className="absolute top-0 left-1/2 h-2 w-0.5 bg-neon-blue/50" />
            </div>
          ))}
        </motion.div>

        {/* Middle ring */}
        <motion.div 
          className="absolute inset-4 rounded-full border-2 border-neon-blue/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner core */}
        <div className="absolute inset-8 rounded-full bg-neon-blue/10 flex items-center justify-center backdrop-blur-sm">
          <div className="w-4 h-4 rounded-full bg-neon-blue animate-pulse shadow-[0_0_20px_rgba(0,255,255,1)]">
            <div className="w-full h-full rounded-full bg-white blur-sm" />
          </div>
        </div>

        {/* Loading progress circle */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-neon-blue/30"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>

      {/* Status text */}
      <motion.div 
        className="absolute bottom-8 text-neon-blue/70 font-mono text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-center">
          <div className="flex gap-1 justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-neon-blue"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 