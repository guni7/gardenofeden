import { usePlayerStatus } from "./common/usePlayerStatus";
import { useSyncStatus } from "./mud/useSyncStatus";
import { useDustClient } from "./common/useDustClient";
import GardenOfEden from "./components/GardenOfEden";

export default function App() {
  const { data: dustClient } = useDustClient();
  const syncStatus = useSyncStatus();
  const playerStatus = usePlayerStatus();

 

 
  if (!dustClient) {
    const url = `https://alpha.dustproject.org?debug-app=${window.location.origin}/dust-app.json`;
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <a href={url} className="text-center text-blue-500 underline">
          Open this page in DUST to connect to dustkit
        </a>
      </div>
    );
  }

  if (!syncStatus.isLive || !playerStatus) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <p className="text-center">Syncing ({syncStatus.percentage}%)...</p>
      </div>
    );
  }

  return <GardenOfEden />;
}
