'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_COLORS = ['#176BFF', '#00AFFF', '#00E5FF', '#FFFFFF'];

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const value = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;

  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function interpolateColor(colors, t) {
  if (!colors.length) return '#ffffff';
  if (colors.length === 1) return colors[0];

  const scaled = Math.min(0.999999, Math.max(0, t)) * (colors.length - 1);
  const index = Math.floor(scaled);
  const progress = scaled - index;

  const a = colors[index];
  const b = colors[index + 1];

  if (!a || !b) return '#ffffff';

  const r = Math.round(a.r + (b.r - a.r) * progress);
  const g = Math.round(a.g + (b.g - a.g) * progress);
  const blue = Math.round(a.b + (b.b - a.b) * progress);

  return `rgb(${r}, ${g}, ${blue})`;
}

export default function PixelCanvas({
  gap = 10,
  speed = 0.075,
  colors = DEFAULT_COLORS,
  variant = 'glow',
  opacity = 0.45,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    if (motionPreference.matches) return;

    const palette = colors
      .map(hexToRgb)
      .filter(Boolean);

    const cellSize = Math.max(5, gap);
    const decaySpeed = Math.max(0.01, Math.min(1, speed));

    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;

    let pixels = [];
    let animationId = 0;
    let lastTime = 0;

    const mouse = {
      x: -1000,
      y: -1000,
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);

      pixels = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          pixels.push({
            x: x * cellSize,
            y: y * cellSize,
            intensity: 0,
            phase: Math.random(),
          });
        }
      }

      wake();
    };

    const draw = (timestamp) => {
      animationId = 0;

      const delta = Math.min(
        lastTime ? timestamp - lastTime : 16.67,
        40
      );

      lastTime = timestamp;

      ctx.clearRect(0, 0, width, height);

      const radius = variant === 'glow' ? 130 : 85;
      const size = Math.max(2, cellSize - 2);

      let active = false;

      for (const pixel of pixels) {
        const centerX = pixel.x + size / 2;
        const centerY = pixel.y + size / 2;

        const dx = mouse.x - centerX;
        const dy = mouse.y - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        let target = 0;

        if (distance < radius) {
          const falloff = 1 - distance / radius;
          target = Math.pow(falloff, 1.5);
        }

        const factor = target > pixel.intensity
          ? 0.28
          : Math.min(1, decaySpeed * delta / 16.67);

        pixel.intensity +=
          (target - pixel.intensity) * factor;

        if (target > 0.01 || pixel.intensity > 0.015) {
          active = true;
        }

        if (pixel.intensity < 0.015) continue;

        const color = interpolateColor(
          palette,
          (pixel.phase + pixel.intensity * 0.3) % 1
        );

        if (variant === 'glow' && pixel.intensity > 0.2) {
          ctx.globalAlpha = pixel.intensity * 0.12;
          ctx.fillStyle = color;

          ctx.fillRect(
            pixel.x - 3,
            pixel.y - 3,
            size + 6,
            size + 6
          );
        }

        ctx.globalAlpha = pixel.intensity * opacity;
        ctx.fillStyle = color;

        if (variant === 'trail' && typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(
            pixel.x,
            pixel.y,
            size,
            size,
            size * 0.25
          );
          ctx.fill();
        } else {
          ctx.fillRect(pixel.x, pixel.y, size, size);
        }
      }

      ctx.globalAlpha = 1;

      if (active) {
        wake();
      } else {
        lastTime = 0;
      }
    };

    function wake() {
      if (!animationId) {
        animationId = requestAnimationFrame(draw);
      }
    }

    const onPointerMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      wake();
    };

    const resetMouse = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      wake();
    };

    const onPointerOut = (event) => {
      if (!event.relatedTarget) resetMouse();
    };

    const onPointerUp = (event) => {
      if (event.pointerType === 'touch') resetMouse();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
        animationId = 0;
        lastTime = 0;
      } else {
        wake();
      }
    };

    resize();

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, {
      passive: true,
    });
    window.addEventListener('pointerout', onPointerOut);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('blur', resetMouse);

    document.addEventListener(
      'visibilitychange',
      onVisibilityChange
    );

    return () => {
      cancelAnimationFrame(animationId);

      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('blur', resetMouse);

      document.removeEventListener(
        'visibilitychange',
        onVisibilityChange
      );
    };
  }, [gap, speed, variant, opacity, colors.join('|')]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}