import { useEffect, useState } from "react";
import GardenOfEden from "./components/GardenOfEden";
import { MapPage } from "./components/MapPage";

type Page = "garden" | "map";

export default function App() {
  const [page, setPage] = useState<Page>(() =>
    window.location.hash === "#map" ? "map" : "garden"
  );

  useEffect(() => {
    window.location.hash = page === "map" ? "map" : "";
  }, [page]);

  const buttonClasses = (target: Page) =>
    [
      "px-6 py-3 font-bold uppercase tracking-wide",
      "border-[3px] transition-all duration-100",
      "text-shadow-minecraft",
      page === target
        ? "bg-gradient-to-b from-[#7CBD6B] to-[#6BAA5C] text-white border-[#4A7C40] shadow-[0_4px_0_#2d5f2e] active:shadow-[0_2px_0_#2d5f2e] active:translate-y-[2px]"
        : "bg-gradient-to-b from-[#8B7355] to-[#6B5345] text-white border-[#4A3829] shadow-[0_4px_0_#2d2419] hover:from-[#9B8365] hover:to-[#7B6355] hover:-translate-y-[2px] hover:shadow-[0_6px_0_#2d2419] active:shadow-[0_2px_0_#2d2419] active:translate-y-[2px]",
    ].join(" ");

  return (
    <div className="relative h-screen w-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .minecraft-nav {
          font-family: 'Minecraft', 'Press Start 2P', monospace;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }

        .text-shadow-minecraft {
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
        }
      `}</style>

      <div className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 gap-3">
        <button
          className={`${buttonClasses("garden")} minecraft-nav`}
          onClick={() => setPage("garden")}
        >
          Garden
        </button>
        <button
          className={`${buttonClasses("map")} minecraft-nav`}
          onClick={() => setPage("map")}
        >
          Spawn Points
        </button>
      </div>

      <div className="h-full w-full">
        {page === "garden" ? <GardenOfEden /> : <MapPage />}
      </div>
    </div>
  );
}
