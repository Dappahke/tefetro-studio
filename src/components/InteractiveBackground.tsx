// src/components/InteractiveBackground.tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isAccent: boolean;
  originalX: number;
  originalY: number;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // TEFETRA BRAND COLORS
  const colors = {
    canvas: '#fcf8f2',      // canvas-50 - background
    sage: '#6faa99',        // sage-500 - particles
    sageAlpha: 'rgba(111, 170, 153, 0.5)',
    sageLine: 'rgba(111, 170, 153, 0.15)',
    deep: '#094453',        // deep-500 - cursor connections
    deepLine: 'rgba(9, 68, 83, 0.4)',
    tefetra: '#ef961c',     // tefetra-500 - accent particles
    tefetraAlpha: 'rgba(239, 150, 28, 0.7)',
  };

  const config = {
    particleCount: 55,
    connectionDistance: 130,
    mouseDistance: 170,
    particleSpeed: 0.25,
    mouseRepel: 0.7,
    returnSpeed: 0.015,
  };

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const isMobile = width < 768;
    const count = isMobile ? 30 : config.particleCount;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        originalX: x,
        originalY: y,
        vx: (Math.random() - 0.5) * config.particleSpeed,
        vy: (Math.random() - 0.5) * config.particleSpeed,
        radius: Math.random() * 2 + 1.5,
        isAccent: Math.random() > 0.9, // 10% orange accent particles
      });
    }
    particlesRef.current = particles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const mouse = mouseRef.current;
    const particles = particlesRef.current;

    // Clear with canvas background
    ctx.fillStyle = colors.canvas;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      // Mouse interaction
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < config.mouseDistance && dist > 0) {
        const force = (config.mouseDistance - dist) / config.mouseDistance;
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * force * config.mouseRepel * 0.08;
        particle.vy += Math.sin(angle) * force * config.mouseRepel * 0.08;
      }

      // Return to original position
      const homeDx = particle.originalX - particle.x;
      const homeDy = particle.originalY - particle.y;
      particle.vx += homeDx * config.returnSpeed;
      particle.vy += homeDy * config.returnSpeed;

      // Apply velocity with damping
      particle.vx *= 0.985;
      particle.vy *= 0.985;
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary check
      if (particle.x < 0 || particle.x > width) particle.vx *= -0.5;
      if (particle.y < 0 || particle.y > height) particle.vy *= -0.5;

      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.isAccent ? colors.tefetraAlpha : colors.sageAlpha;
      ctx.fill();
    });

    // Draw connections
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      // Particle to particle
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < config.connectionDistance * config.connectionDistance) {
          const dist = Math.sqrt(distSq);
          const opacity = 1 - dist / config.connectionDistance;
          ctx.strokeStyle = colors.sageLine.replace('0.15', `${opacity * 0.2}`);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Mouse connections
      if (mouse.x > 0) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < config.mouseDistance * config.mouseDistance) {
          const dist = Math.sqrt(distSq);
          const opacity = 1 - dist / config.mouseDistance;
          ctx.strokeStyle = colors.deepLine.replace('0.4', `${opacity * 0.6}`);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      
      initParticles(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      aria-hidden="true"
    />
  );
}