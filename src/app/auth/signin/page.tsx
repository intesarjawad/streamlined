'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { DiscordIcon } from '@/components/icons/discord';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const GlitchText = ({ 
  children, 
  intensity = "medium" 
}: { 
  children: React.ReactNode;
  intensity?: "subtle" | "low" | "medium" | "high";
}) => {
  const intensityClasses = {
    subtle: "glitch-layer-1-subtle glitch-layer-2-subtle",
    low: "glitch-layer-1-low glitch-layer-2-low",
    medium: "glitch-layer-1 glitch-layer-2",
    high: "glitch-layer-1-high glitch-layer-2-high"
  };

  return (
    <div className="relative inline-block">
      {/* Original text */}
      <span className="relative z-10 text-neon-blue">
        {children}
      </span>
      
      {/* Glitch layers */}
      <span className={`${intensityClasses[intensity].split(' ')[0]} absolute inset-0 text-neon-blue clip-text`} aria-hidden>
        {children}
      </span>
      <span className={`${intensityClasses[intensity].split(' ')[1]} absolute inset-0 text-neon-blue clip-text`} aria-hidden>
        {children}
      </span>
    </div>
  );
};

const ArcReactor = ({ isButtonHovered = false, isButtonActive = false, onClick }: { 
  isButtonHovered?: boolean;
  isButtonActive?: boolean;
  onClick?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isGlowing = isHovered || isButtonHovered || isButtonActive;
  
  return (
    <div 
      className="relative w-80 h-80 cursor-pointer transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Enhanced ambient glow */}
      <div className="absolute inset-0 blur-3xl">
        <div className="absolute inset-1/4 bg-neon-blue/60 rounded-full animate-pulse-slow" />
      </div>

      {/* Outer casing with enhanced glow and hover effect */}
      <div className={cn(
        "absolute inset-0 rounded-full border-8 border-neon-blue/40 bg-neon-blue/10",
        "transition-all duration-300",
        isGlowing ? 
          "shadow-[inset_0_0_60px_rgba(0,255,255,0.4),0_0_60px_rgba(0,255,255,0.6)]" : 
          "shadow-[inset_0_0_60px_rgba(0,255,255,0.2),0_0_30px_rgba(0,255,255,0.4)]"
      )}>
        {/* Outer ring segments with glowing markers */}
        {[...Array(36)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 10}deg)` }}
          >
            <div className={cn(
              "absolute top-0 left-1/2 h-4 w-0.5 transition-all duration-300",
              isGlowing ? 
                "bg-neon-blue shadow-[0_0_15px_rgba(0,255,255,1)]" : 
                "bg-neon-blue/70 shadow-[0_0_10px_rgba(0,255,255,0.8)]"
            )} />
          </div>
        ))}
      </div>

      {/* Main reactor rings with increased glow */}
      <div className={cn(
        "absolute inset-8 rounded-full border-4 border-neon-blue/70 bg-neon-blue/20",
        "transition-all duration-300",
        isGlowing ?
          "shadow-[inset_0_0_40px_rgba(0,255,255,0.4),0_0_30px_rgba(0,255,255,0.6)]" :
          "shadow-[inset_0_0_30px_rgba(0,255,255,0.3),0_0_20px_rgba(0,255,255,0.5)]"
      )}>
        {/* Rotating energy ring */}
        <motion.div
          className="absolute inset-4 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full">
                <div className="w-full h-2 bg-neon-blue shadow-[0_0_15px_rgba(0,255,255,1)] blur-[1px]" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Inner reactor core with intensified glow */}
      <div className={cn(
        "absolute inset-16 rounded-full bg-neon-blue/10 overflow-hidden backdrop-blur-sm",
        "transition-all duration-300",
        isGlowing ?
          "shadow-[inset_0_0_50px_rgba(0,255,255,0.5),0_0_40px_rgba(0,255,255,0.7)]" :
          "shadow-[inset_0_0_40px_rgba(0,255,255,0.4),0_0_30px_rgba(0,255,255,0.6)]"
      )}>
        {/* Core energy rings */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 rounded-full border-2 border-neon-blue 
                        shadow-[inset_0_0_20px_rgba(0,255,255,0.6),0_0_15px_rgba(0,255,255,0.8)]" />
        </motion.div>

        {/* Central core with intense glow */}
        <div className="absolute inset-4 rounded-full bg-neon-blue/20 flex items-center justify-center backdrop-blur-xl">
          <div className={cn(
            "w-12 h-12 rounded-full bg-neon-blue animate-pulse transition-all duration-300",
            isGlowing ?
              "shadow-[0_0_50px_rgba(0,255,255,1),inset_0_0_25px_rgba(255,255,255,0.9)]" :
              "shadow-[0_0_40px_rgba(0,255,255,1),inset_0_0_20px_rgba(255,255,255,0.8)]"
          )}>
            <div className="w-full h-full rounded-full bg-white blur-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Additional outer glow effect */}
      <div className={cn(
        "absolute -inset-2 rounded-full opacity-50 transition-all duration-300",
        isGlowing ?
          "shadow-[0_0_80px_rgba(0,255,255,0.7),inset_0_0_80px_rgba(0,255,255,0.7)]" :
          "shadow-[0_0_60px_rgba(0,255,255,0.6),inset_0_0_60px_rgba(0,255,255,0.6)]"
      )} />
    </div>
  );
};

export default function SignInPage() {
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center min-h-screen bg-[#000000] overflow-hidden font-mono"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,255,255,0.03) 0%, #000000 50%)`,
      }}
    >
      {/* Animated scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-3" />

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: loaded ? 1 : 0.95, opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 blur-3xl">
            <div className="absolute inset-1/3 bg-neon-blue/10 rounded-full animate-pulse-slow" />
          </div>
          <ArcReactor 
            isButtonHovered={isButtonHovered} 
            isButtonActive={isButtonActive}
            onClick={() => signIn('discord', { callbackUrl: '/' })}
          />
        </motion.div>

        {/* Commented out hero text for AB testing
        <motion.h1 
          className="text-5xl font-bold mt-8 mb-2 tracking-wider font-mono"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <GlitchText intensity="low">THE MACHINE</GlitchText>
        </motion.h1>
        */}

        {/* Commented out sign in button for AB testing
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 w-full max-w-md"
        >
          <Button 
            className="w-full py-6 text-lg font-semibold relative overflow-hidden group
                     bg-black hover:bg-neon-blue/20 border-2 border-neon-blue/50
                     transition-all duration-300"
            onClick={() => signIn('discord', { callbackUrl: '/' })}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            onMouseDown={() => setIsButtonActive(true)}
            onMouseUp={() => setIsButtonActive(false)}
            onTouchStart={() => setIsButtonActive(true)}
            onTouchEnd={() => setIsButtonActive(false)}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 text-neon-blue group-hover:text-white">
              <DiscordIcon className="w-6 h-6" />
              <GlitchText intensity="subtle">Initialize Discord Authentication</GlitchText>
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-neon-blue/20" />
          </Button>
        </motion.div>
        */}
      </motion.div>

      {/* HUD elements */}
      <motion.div 
        className="absolute top-4 left-4 text-neon-blue font-mono text-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: loaded ? 1 : 0, x: 0 }}
        transition={{ delay: 1.1 }}
      >
        <GlitchText intensity="low">System: THE MACHINE v0.3</GlitchText>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-4 right-4 text-neon-blue font-mono text-sm"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: loaded ? 1 : 0, x: 0 }}
        transition={{ delay: 1.1 }}
      >
        <GlitchText intensity="low">Status: Awaiting Authentication</GlitchText>
      </motion.div>
    </div>
  );
} 