'use client';

import React, { useEffect, useRef } from 'react';

export function Cyber3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // 3D Nodes in space
    const NODE_COUNT = 55;
    const nodes: Array<{
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      radius: number;
      color: string;
      speed: number;
      pulse: number;
    }> = [];

    const colors = ['#06b6d4', '#3b82f6', '#10b981', '#8b5cf6'];

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * width * 1.5;
      const y = (Math.random() - 0.5) * height * 1.2;
      const z = Math.random() * 800 + 200;
      nodes.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Grid plane lines in 3D perspective
    let gridOffset = 0;

    const render = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Cyber Horizon Gradient
      const grad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        50,
        width / 2,
        height * 0.45,
        width * 0.8
      );
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.07)');
      grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
      grad.addColorStop(1, 'rgba(11, 15, 23, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw 3D Perspective Floor Grid
      const horizonY = height * 0.48;
      const fov = 350;
      const rotY = (mouseX - width / 2) * 0.0003;
      const rotX = (mouseY - height / 2) * 0.0002;

      gridOffset = (gridOffset + 0.8) % 40;

      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.14)';
      ctx.lineWidth = 1;

      // Vertical lines fan out from vanishing point
      const lines = 24;
      const vpX = width / 2 + (mouseX - width / 2) * 0.1;
      for (let i = -lines; i <= lines; i++) {
        const xBottom = width / 2 + i * (width / (lines * 0.9));
        ctx.beginPath();
        ctx.moveTo(vpX, horizonY);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Horizontal lines in perspective moving forward
      const numHoriz = 16;
      for (let i = 0; i < numHoriz; i++) {
        const rawZ = i * 40 - gridOffset + 40;
        if (rawZ <= 0) continue;
        const progress = Math.pow(i / numHoriz, 2.5);
        const y = horizonY + progress * (height - horizonY);

        const alpha = Math.min(0.25, progress * 0.35);
        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // Draw 3D Floating Threat Nodes & Cyber Constellations
      const projectedNodes: Array<{ px: number; py: number; scale: number; color: string; radius: number }> = [];

      nodes.forEach((node) => {
        node.pulse += 0.03;
        node.z -= node.speed;
        if (node.z < 50) {
          node.z = 1000;
        }

        // Apply 3D rotation based on mouse parallax
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);

        const nx = node.x * cosY - node.z * sinY;
        const nz = node.z * cosY + node.x * sinY;
        const ny = node.y * cosX - nz * sinX;

        // Perspective projection
        const scale = fov / (fov + nz);
        const px = width / 2 + nx * scale;
        const py = height * 0.4 + ny * scale;

        if (nz > 0 && px >= -50 && px <= width + 50 && py >= -50 && py <= height + 50) {
          projectedNodes.push({
            px,
            py,
            scale,
            color: node.color,
            radius: node.radius * scale * (1 + 0.2 * Math.sin(node.pulse)),
          });
        }
      });

      // Connect close nodes with glowing neural threads
      ctx.lineWidth = 0.75;
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const a = projectedNodes[i];
          const b = projectedNodes[j];
          const dx = a.px - b.px;
          const dy = a.py - b.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.18 * Math.min(a.scale, b.scale);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }
      }

      // Draw node particles
      projectedNodes.forEach((p) => {
        const glow = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, p.radius * 3);
        glow.addColorStop(0, p.color);
        glow.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-80"
    />
  );
}
