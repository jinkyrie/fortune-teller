"use client";

import { motion } from "framer-motion";

interface AnimatedCoffeeCupProps {
  size?: 'small' | 'medium' | 'large';
}

export default function AnimatedCoffeeCup({ size = 'medium' }: AnimatedCoffeeCupProps) {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24'
  };

  return (
    <div className={`coffee-cup ${sizeClasses[size]}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Saucer */}
        <ellipse
          cx="50"
          cy="85"
          rx="35"
          ry="8"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Cup */}
        <path
          d="M35 60 L35 75 Q35 80 40 80 L60 80 Q65 80 65 75 L65 60"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Cup Top Rim */}
        <path
          d="M35 60 L65 60"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Handle */}
        <path
          d="M65 65 Q75 65 75 70 Q75 75 65 75"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Steam 1 */}
        <motion.path
          d="M40 55 Q35 40 40 25"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{
            y: [0, -2, -4],
            opacity: [0.9, 0.6, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Steam 2 */}
        <motion.path
          d="M50 55 Q45 35 50 20"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{
            y: [0, -2, -4],
            opacity: [0.9, 0.6, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />
        {/* Steam 3 */}
        <motion.path
          d="M60 55 Q55 40 60 25"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{
            y: [0, -2, -4],
            opacity: [0.9, 0.6, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.6,
          }}
        />
      </svg>
    </div>
  );
}
