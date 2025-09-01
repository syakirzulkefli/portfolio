'use client';

import { useEffect, useState } from 'react';

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(90, 103, 216, 0.6), rgba(90, 103, 216, 0.4))`,
            animation: `floatParticle ${particle.duration}s infinite ${particle.delay}s ease-in-out`,
          }}
        />
      ))}
      
      {/* Animated geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border opacity-30 rounded-full animate-spin" style={{ borderColor: 'rgba(90, 103, 216, 0.2)', animationDuration: '20s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 border opacity-30 rotate-45 animate-pulse" style={{ borderColor: 'rgba(90, 103, 216, 0.25)' }} />
      <div className="absolute bottom-40 left-20 w-12 h-12 border opacity-30 rounded-full animate-bounce" style={{ borderColor: 'rgba(90, 103, 216, 0.3)', animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-24 h-24 border opacity-30 rotate-12 animate-pulse" style={{ borderColor: 'rgba(90, 103, 216, 0.2)', animationDelay: '1s' }} />
    </div>
  );
}