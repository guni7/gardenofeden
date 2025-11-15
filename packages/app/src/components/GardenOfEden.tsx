import { useEffect, useRef } from 'react';

export default function GardenOfEden() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const DEFAULT_CELL_SIZE = 32;
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
      // Minecraft Programmer Art sky blue background
      ctx.fillStyle = '#7FA1FF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Minecraft Programmer Art grass block colors
      const grassTop = '#7CBD6B';
      const dirtSideTop = '#96683B';
      const dirtSideMid = '#8B5A2B';
      const dirtSideBottom = '#7A4F1F';
      const depth = Math.max(4, Math.floor(cellSize * 0.7));

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (!grid[idx(x, y)]) continue;
          const px = x * cellSize;
          const py = y * cellSize;

          // Draw grass top (bright green)
          ctx.fillStyle = grassTop;
          ctx.fillRect(px, py, cellSize, cellSize);

          // Add slight texture variation to grass
          ctx.fillStyle = 'rgba(106, 168, 79, 0.3)';
          ctx.fillRect(px, py, cellSize / 2, cellSize / 2);
          ctx.fillRect(px + cellSize / 2, py + cellSize / 2, cellSize / 2, cellSize / 2);

          // Draw dirt side with gradient
          const g = ctx.createLinearGradient(0, py + cellSize, 0, py + cellSize + depth);
          g.addColorStop(0, dirtSideTop);
          g.addColorStop(0.5, dirtSideMid);
          g.addColorStop(1, dirtSideBottom);
          ctx.fillStyle = g;
          ctx.fillRect(px, py + cellSize, cellSize, depth);

          // Add block outline for that classic Minecraft look
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, cellSize, cellSize);
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
          background: #7FA1FF;
          display: block;
          z-index: 0;
        }

        .garden-content {
          position: relative;
          z-index: 1;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1rem;
        }

        .garden-title {
          font-family: 'Minecraft', 'Cinzel', serif;
          font-weight: 700;
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin: 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #FFFFFF;
          text-align: center;
          text-shadow:
            3px 3px 0 #3F3F3F,
            0 0 10px rgba(255, 255, 255, 0.5);
          line-height: 1.4;
          max-width: 90%;
        }

        @media (min-width: 600px) {
          .garden-title {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
          }
        }

        .mc-gradient {
          display: block;
          font-family: 'Minecraft', 'Uncial Antiqua', cursive;
          font-size: 1.1em;
          letter-spacing: 0.03em;
          margin-top: 0.3em;
          background: linear-gradient(180deg,
            #FFD700 0%,
            #FFA500 25%,
            #FF8C00 50%,
            #FF6347 75%,
            #DC143C 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow:
            2px 2px 0 #3F3F3F,
            3px 3px 0 #2F2F2F,
            4px 4px 8px rgba(0,0,0,0.5);
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))
                  brightness(1.1);
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
