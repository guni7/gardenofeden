import { useMemo } from "react";
import { CRS, TileLayer as LeafletTileLayer } from "leaflet";
import { MapContainer, type TileLayerProps } from "react-leaflet";
import { createTileLayerComponent } from "@react-leaflet/core";
import "leaflet/dist/leaflet.css";

type Vec2 = [number, number];
type Vec3 = readonly [number, number, number];

const worldLowerCorner: Vec3 = [-1536, -64, -3072];
const worldUpperCorner: Vec3 = [2560, 320, 1024];
const minZoom = -1;
const maxZoom = 4;
const tileSize = 512;

const worldToMapCoordinates = (pos: Vec3): Vec2 => [-pos[2], pos[0]];

const bounds: [Vec2, Vec2] = [
  worldToMapCoordinates(worldLowerCorner),
  worldToMapCoordinates(worldUpperCorner),
];

// force map to re-render cleanly in dev
const mapInstanceKey = Date.now();

export function MapPage() {
  const tileUrl = useMemo(
    () => (coords: { x: number; y: number; z: number }) =>
      `/tiles/${coords.x}/${coords.y}/${coords.z}/tile`,
    []
  );

  return (
    <div className="map flex relative z-0 h-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: none !important;
        }

        .leaflet-control-zoom a {
          background: linear-gradient(180deg, #8B7355 0%, #6B5345 100%) !important;
          color: white !important;
          border: 3px solid #4A3829 !important;
          box-shadow: 0 4px 0 #2d2419 !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 30px !important;
          font-family: 'Minecraft', 'Press Start 2P', monospace !important;
          font-size: 18px !important;
          font-weight: bold !important;
          text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5) !important;
          transition: all 0.1s ease !important;
          border-radius: 0 !important;
          margin-bottom: 4px !important;
        }

        .leaflet-control-zoom a:hover {
          background: linear-gradient(180deg, #9B8365 0%, #7B6355 100%) !important;
          color: white !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 0 #2d2419 !important;
        }

        .leaflet-control-zoom a:active {
          transform: translateY(2px) !important;
          box-shadow: 0 2px 0 #2d2419 !important;
        }

        .leaflet-control-zoom a.leaflet-disabled {
          opacity: 0.4 !important;
          cursor: not-allowed !important;
          background: linear-gradient(180deg, #6B5345 0%, #5B4335 100%) !important;
        }

        .leaflet-control-zoom a.leaflet-disabled:hover {
          transform: none !important;
          box-shadow: 0 4px 0 #2d2419 !important;
        }
      `}</style>
      <MapContainer
        key={mapInstanceKey}
        crs={CRS.Simple}
        center={[0, 0]}
        minZoom={minZoom}
        maxZoom={maxZoom}
        maxBoundsViscosity={0.5}
        bounds={bounds}
        maxBounds={bounds}
        zoom={2}
        attributionControl={false}
        zoomControl
        className="h-full w-full"
        preferCanvas
      >
        <TileLayer
          getTileUrl={tileUrl}
          tileSize={tileSize}
          minNativeZoom={0}
          maxNativeZoom={maxZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          updateWhenIdle
          updateWhenZooming={false}
          updateInterval={500}
          keepBuffer={2}
          crossOrigin="anonymous"
        />
      </MapContainer>
    </div>
  );
}

const TileLayer = createTileLayerComponent<
  LeafletTileLayer,
  Omit<TileLayerProps, "url"> & Pick<LeafletTileLayer, "getTileUrl">
>(
  ({ getTileUrl, ...props }, context) => {
    const layer = new LeafletTileLayer("", props);
    layer.getTileUrl = getTileUrl;
    return {
      instance: layer,
      context: { ...context, layerContainer: layer },
    } as never;
  },
  (layer, props) => {
    layer.getTileUrl = props.getTileUrl;
  }
);
