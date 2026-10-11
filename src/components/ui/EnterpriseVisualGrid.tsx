'use client';

import React, { useEffect, useRef } from 'react';

export function EnterpriseVisualGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Subtle enterprise security nodes
    const NODE_COUNT = 48;
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      pulse: number;
    }> = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.3 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Packet pulses traveling between nodes
    interface Packet {
      from: number;
      to: number;
      progress: number;
      speed: number;
    }
    const packets: Packet[] = [];

    const render = () => {
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // Warm ambient luxury gradient in the center
      const centerGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        50,
        width * 0.5,
        height * 0.35,
        width * 0.75
      );
      centerGrad.addColorStop(0, 'rgba(245, 158, 11, 0.045)'); // warm champagne
      centerGrad.addColorStop(0.4, 'rgba(99, 102, 241, 0.025)'); // rich indigo
      centerGrad.addColorStop(1, 'rgba(9, 12, 19, 0)');
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, width, height);

      // Move & draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = height;
        if (node.y > height) node.y = 0;

        // Subtle parallax shift from mouse
        const dx = (mouseX - width / 2) * 0.015;
        const dy = (mouseY - height / 2) * 0.015;
        const drawX = node.x + dx;
        const drawY = node.y + dy;

        const currentAlpha = node.baseAlpha * (0.8 + 0.2 * Math.sin(node.pulse));
        ctx.fillStyle = `rgba(245, 158, 11, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nodes within range
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);

          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.12;
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            // Randomly spawn packets
            if (packets.length < 8 && Math.random() < 0.003) {
              packets.push({ from: i, to: j, progress: 0, speed: 0.01 + Math.random() * 0.015 });
            }
          }
        }
      }

      // Draw active telemetry packets traveling along links
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const startNode = nodes[pkt.from];
        const endNode = nodes[pkt.to];
        if (!startNode || !endNode) continue;

        const px = startNode.x + (endNode.x - startNode.x) * pkt.progress;
        const py = startNode.y + (endNode.y - startNode.y) * pkt.progress;

        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
    />
  );
}
