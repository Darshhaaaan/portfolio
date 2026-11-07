'use client';

import { useEffect, useRef } from 'react';

class Particle {
  constructor(x, y, size, color, dispersion, returnSpeed) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;

    this.originX = x;
    this.originY = y;

    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;

    this.size = size;
    this.color = color;
    this.dispersion = dispersion;
    this.returnSpeed = returnSpeed;
  }

  update(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = 120;

    if (distance < radius && distance > 0.01) {
      const force = (radius - distance) / radius;

      this.vx -= (dx / distance) * force * this.dispersion;
      this.vy -= (dy / distance) * force * this.dispersion;
    }

    this.vx += (this.originX - this.x) * this.returnSpeed;
    this.vy += (this.originY - this.y) * this.returnSpeed;

    this.vx *= 0.85;
    this.vy *= 0.85;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function CursorDrivenParticleTypography({
  className = '',
  text,
  fontSize = 160,
fontFamily,
letterSpacing = 5,
particleSize = 1.8,
  particleDensity = 6,
  dispersionStrength = 15,
  returnSpeed = 0.08,
  color,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    });

    if (!ctx) return;

    let particles = [];
    let animationId;

    let mouseX = -1000;
    let mouseY = -1000;

    const init = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const computedStyle = window.getComputedStyle(container);

      const textColor = color || computedStyle.color;
      const actualFont = fontFamily || computedStyle.fontFamily;

      const lines = text.split('\n');

let actualFontSize = Math.min(fontSize, width * 0.18);

ctx.letterSpacing = `${letterSpacing}px`;
ctx.font = `bold ${actualFontSize}px ${actualFont}`;

const widestLine = Math.max(
  ...lines.map(line => ctx.measureText(line).width)
);

if (widestLine > width * 0.94) {
  actualFontSize *= (width * 0.94) / widestLine;
}

ctx.font = `bold ${actualFontSize}px ${actualFont}`;
ctx.letterSpacing = `${letterSpacing}px`;

ctx.textAlign = 'left';
ctx.textBaseline = 'middle';
ctx.fillStyle = textColor;

const lineHeight = actualFontSize * 1.08;

const startY =
  height / 2 - ((lines.length - 1) * lineHeight) / 2;

const textX = width * 0.025;

lines.forEach((line, index) => {
  ctx.fillText(
    line,
    textX,
    startY + index * lineHeight
  );
});

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      particles = [];

      const step = Math.max(
        1,
        Math.floor(particleDensity * dpr)
      );

      for (let y = 0; y < imageData.height; y += step) {
        for (let x = 0; x < imageData.width; x += step) {
          const index = (y * imageData.width + x) * 4;
          const alpha = imageData.data[index + 3];

          if (alpha > 128) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                textColor,
                dispersionStrength,
                returnSpeed
              )
            );
          }
        }
      }

      ctx.clearRect(0, 0, width, height);
    };

    const animate = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();

      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;

      const rect = canvas.getBoundingClientRect();

      mouseX = e.touches[0].clientX - rect.left;
      mouseY = e.touches[0].clientY - rect.top;
    };

    const resizeObserver = new ResizeObserver(init);

    resizeObserver.observe(container);

    const timeout = setTimeout(() => {
      init();
      animate();
    }, 100);

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchMove, {
      passive: true,
    });
    canvas.addEventListener('touchmove', handleTouchMove, {
      passive: true,
    });
    canvas.addEventListener('touchend', handleMouseLeave);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationId);

      resizeObserver.disconnect();

      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseLeave);
    };
  }, [
    text,
    fontSize,
    fontFamily,
    letterSpacing,
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
    color,
  ]);

  return (
    <div
      ref={containerRef}
      className={`particle-typography ${className}`}
      role="img"
      aria-label={text.replace(/\n/g, ' ')}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}