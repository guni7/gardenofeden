import { useEffect, useRef } from 'react';

export default function GardenOfEden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const DEFAULT_CELL_SIZE = 48;
    const DEFAULT_DENSITY = 0.18;
    const DEFAULT_FPS = 8;

    let cellSize = DEFAULT_CELL_SIZE;
    let density = DEFAULT_DENSITY;
    let fps = DEFAULT_FPS;
    let running = true;

    let cols = 0, rows = 0;
    let grid = new Uint8Array();
    let next = new Uint8Array();

    const idx = (x: number, y: number) => (y * cols + x);

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = Math.floor(window.innerWidth);
      const h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(10, Math.floor(w / cellSize));
      rows = Math.max(10, Math.floor(h / cellSize));
      grid = new Uint8Array(cols * rows);
      next = new Uint8Array(cols * rows);
      seedRandom();
    };

    const seedRandom = () => {
      for (let i = 0; i < grid.length; i++) grid[i] = 0;
      const total = Math.floor(cols * rows * density);
      for (let i = 0; i < total; i++) {
        const x = (Math.random() * cols) | 0;
        const y = (Math.random() * rows) | 0;
        grid[idx(x, y)] = 1;
      }
    };

    const step = () => {
      for (let y = 0; y < rows; y++) {
        const yUp = (y === 0 ? rows - 1 : y - 1);
        const yDn = (y === rows - 1 ? 0 : y + 1);
        for (let x = 0; x < cols; x++) {
          const xLt = (x === 0 ? cols - 1 : x - 1);
          const xRt = (x === cols - 1 ? 0 : x + 1);
          const n = grid[idx(xLt, yUp)] + grid[idx(x, yUp)] + grid[idx(xRt, yUp)] +
                    grid[idx(xLt, y)]                     + grid[idx(xRt, y)] +
                    grid[idx(xLt, yDn)] + grid[idx(x, yDn)] + grid[idx(xRt, yDn)];
          const alive = grid[idx(x, y)];
          next[idx(x, y)] = (n === 3 || (alive && n === 2)) ? 1 : 0;
        }
      }
      const tmp = grid; grid = next; next = tmp;
    };

    const render = () => {
      ctx.fillStyle = '#000010';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grassBase = '#3caa3e';
      const dirtSideTop = '#7a5330';
      const dirtSideMid = '#614126';
      const dirtSideBottom = '#4e341e';
      const depth = Math.max(4, Math.floor(cellSize * 0.9));

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (!grid[idx(x, y)]) continue;
          const px = x * cellSize;
          const py = y * cellSize;

          ctx.fillStyle = grassBase;
          ctx.fillRect(px, py, cellSize, cellSize);

          const g = ctx.createLinearGradient(0, py + cellSize, 0, py + cellSize + depth);
          g.addColorStop(0, dirtSideTop);
          g.addColorStop(0.6, dirtSideMid);
          g.addColorStop(1, dirtSideBottom);
          ctx.fillStyle = g;
          ctx.fillRect(px, py + cellSize, cellSize, depth);
        }
      }
    };

    let last = 0;
    let animationFrameId: number;

    const loop = (t: number) => {
      if (running) {
        const msPerFrame = 1000 / fps;
        if (t - last >= msPerFrame) {
          step();
          render();
          last = t;
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    const handleResize = () => {
      resize();
      render();
    };

    window.addEventListener('resize', handleResize);
    resize();
    render();
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Uncial+Antiqua&display=swap');

        .garden-canvas {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          background: #000;
          display: block;
          z-index: 0;
          opacity: 0.6;
        }

        .garden-content {
          position: relative;
          z-index: 1;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .garden-title {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          font-size: clamp(3rem, 2.5rem + 4vw, 6.5rem);
          margin: 0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
          text-align: center;
          text-shadow:
            0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(255, 215, 0, 0.6),
            0 0 30px rgba(255, 215, 0, 0.4),
            0 5px 0 #0b2a0b,
            0 8px 0 #0b2a0b,
            0 11px 0 #0b2a0b,
            0 14px 0 #0b2a0b,
            0 18px 25px rgba(0,0,0,0.8),
            0 0 40px rgba(0, 255, 225, 0.3);
          line-height: 1.3;
          animation: titlePulse 3s ease-in-out infinite;
        }

        @keyframes titlePulse {
          0%, 100% {
            text-shadow:
              0 0 10px rgba(255, 215, 0, 0.8),
              0 0 20px rgba(255, 215, 0, 0.6),
              0 0 30px rgba(255, 215, 0, 0.4),
              0 5px 0 #0b2a0b,
              0 8px 0 #0b2a0b,
              0 11px 0 #0b2a0b,
              0 14px 0 #0b2a0b,
              0 18px 25px rgba(0,0,0,0.8),
              0 0 40px rgba(0, 255, 225, 0.3);
          }
          50% {
            text-shadow:
              0 0 20px rgba(255, 215, 0, 1),
              0 0 30px rgba(255, 215, 0, 0.8),
              0 0 40px rgba(255, 215, 0, 0.6),
              0 5px 0 #0b2a0b,
              0 8px 0 #0b2a0b,
              0 11px 0 #0b2a0b,
              0 14px 0 #0b2a0b,
              0 18px 25px rgba(0,0,0,0.9),
              0 0 50px rgba(0, 255, 225, 0.5);
          }
        }

        .mc-gradient {
          display: block;
          font-family: 'Uncial Antiqua', cursive;
          font-size: 1.2em;
          letter-spacing: 0.05em;
          background: linear-gradient(180deg,
            #70ef80 0%,
            #4fe760 15%,
            #3bdc54 30%,
            #2fa443 50%,
            #956b3a 70%,
            #7d5832 85%,
            #6b4b2a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow:
            0 2px 0 #174717,
            0 4px 0 #164616,
            0 6px 0 #144014,
            0 8px 0 #113d11,
            0 12px 16px rgba(0,0,0,0.9);
          filter: drop-shadow(0 0 18px rgba(94, 255, 112, 0.5))
                  drop-shadow(0 0 8px rgba(112, 239, 128, 0.4))
                  brightness(1.08);
        }
      `}</style>

      <canvas ref={canvasRef} className="garden-canvas" />

      <div className="garden-content">
        <h1 className="garden-title">
          Welcome to the<br />
          <span className="mc-gradient">Garden of Eden</span>
        </h1>
      </div>
    </div>
  );
}
