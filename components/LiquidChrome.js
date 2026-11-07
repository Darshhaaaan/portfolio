'use client';

import { useEffect, useRef } from 'react';

const DEFAULT_COLOR = [0.1, 0.1, 0.1];

const vertexShaderSource = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec3 u_baseColor;
  uniform float u_amplitude;

  const mat2 m = mat2(0.80, 0.60, -0.60, 0.80);

  float hash(vec2 p) {
    float h = dot(p, vec2(127.1, 311.7));
    return fract(sin(h) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float f = 0.0;

    f += 0.5000 * noise(p);
    p = m * p * 2.02;

    f += 0.2500 * noise(p);
    p = m * p * 2.03;

    f += 0.1250 * noise(p);
    p = m * p * 2.01;

    f += 0.0625 * noise(p);

    return f / 0.9375;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    vec2 p = -1.0 + 2.0 * uv;
    p.x *= u_resolution.x / u_resolution.y;

    vec2 mouse = (u_mouse - 0.5) * 2.0;
    mouse.x *= u_resolution.x / u_resolution.y;

    vec2 diff = p - mouse;
    float dist = length(diff);

    vec2 distortion = vec2(0.0);

    if (dist > 0.0) {
      distortion = (diff / dist) * exp(-dist * 3.0) * 0.1;
    }

    p += distortion;

    float time = u_time * 0.5;

    vec2 q;

    q.x = fbm(p + time * 0.1);
    q.y = fbm(p + vec2(5.2, 1.3) + time * 0.15);

    vec2 r;

    r.x = fbm(p + 4.0 * q + vec2(1.7, 9.2) + time * 0.2);
    r.y = fbm(p + 4.0 * q + vec2(8.3, 2.8) + time * 0.25);

    float f = fbm(p + r * 4.0 * u_amplitude);

    vec3 col = u_baseColor;

    float highlight = smoothstep(0.4, 0.6, f);
    float highlight2 = smoothstep(0.6, 0.8, f);
    float dark = smoothstep(0.1, 0.3, f);

    col = mix(col, vec3(0.0), 1.0 - dark);
    col = mix(col, vec3(0.8, 0.8, 0.9), highlight);
    col = mix(col, vec3(1.0), highlight2);

    float v = 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);

    col *= 0.5 + 0.5 * pow(max(0.0, v), 0.2);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);

  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default function LiquidChrome({
  baseColor = DEFAULT_COLOR,
  speed = 1,
  amplitude = 0.6,
  interactive = true,
  opacity = 0.35,
}) {
  const canvasRef = useRef(null);

  const settingsRef = useRef({});
  settingsRef.current = { baseColor, speed, amplitude, interactive };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });

    if (!gl) {
      console.warn('WebGL is not supported by this browser.');
      return;
    }

    const vertexShader = createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    );

    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();

    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));

      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();

    if (!buffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'position');

    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const colorLocation = gl.getUniformLocation(program, 'u_baseColor');
    const amplitudeLocation = gl.getUniformLocation(program, 'u_amplitude');

    const mouse = { x: 0.5, y: 0.5 };

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    let animationFrame = 0;
    let disposed = false;
    let startTime = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));

      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.uniform2f(
        resolutionLocation,
        canvas.width,
        canvas.height
      );

      renderFrame(performance.now());
      startAnimation();
    };

    const renderFrame = (time) => {
      if (disposed) return;

      const settings = settingsRef.current;

      const elapsed =
        ((time - startTime) / 1000) * Math.max(0, settings.speed);

      const color = settings.baseColor || DEFAULT_COLOR;

      gl.uniform1f(timeLocation, elapsed);

      gl.uniform2f(
        mouseLocation,
        mouse.x,
        mouse.y
      );

      gl.uniform3f(
        colorLocation,
        color[0],
        color[1],
        color[2]
      );

      gl.uniform1f(
        amplitudeLocation,
        settings.amplitude
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const animate = (time) => {
      animationFrame = 0;

      if (disposed || document.hidden) return;

      renderFrame(time);

      if (!motionPreference.matches) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const startAnimation = () => {
      if (
        !disposed &&
        !document.hidden &&
        !motionPreference.matches &&
        !animationFrame
      ) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event) => {
      if (!settingsRef.current.interactive) return;
      if (motionPreference.matches) return;

      const rect = canvas.getBoundingClientRect();

      mouse.x = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      );

      mouse.y = Math.max(
        0,
        Math.min(1, 1 - (event.clientY - rect.top) / rect.height)
      );

      startAnimation();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        startTime = performance.now();
        renderFrame(startTime);
        startAnimation();
      }
    };

    const handleMotionChange = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;

      renderFrame(performance.now());
      startAnimation();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });

    document.addEventListener('visibilitychange', handleVisibility);

    motionPreference.addEventListener('change', handleMotionChange);

    resize();
    renderFrame(performance.now());
    startAnimation();

    return () => {
      disposed = true;

      cancelAnimationFrame(animationFrame);

      observer.disconnect();

      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);

      document.removeEventListener('visibilitychange', handleVisibility);

      motionPreference.removeEventListener('change', handleMotionChange);

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        zIndex: 0,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}