import { SPAWN_RADIUS } from './constants';

export function getSpawnCoord(
  spawnTileCoord: readonly [number, number, number]
): [number, number, number] {
  const dx = Math.round(Math.random() * (SPAWN_RADIUS * 2)) - SPAWN_RADIUS;
  const dz = Math.round(Math.random() * (SPAWN_RADIUS * 2)) - SPAWN_RADIUS;
  // Always spawn 2 blocks above the spawn tile to ensure spawning in air
  const dy = -2;
  return [
    spawnTileCoord[0] + dx,
    spawnTileCoord[1] + dy,
    spawnTileCoord[2] + dz,
  ];
}
