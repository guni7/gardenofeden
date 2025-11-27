import { SPAWN_RADIUS } from './constants';

export function getSpawnCoord(
  spawnTileCoord: readonly [number, number, number]
): [number, number, number] {
  const dx = Math.round(Math.random() * (SPAWN_RADIUS * 2)) - SPAWN_RADIUS;
  const dz = Math.round(Math.random() * (SPAWN_RADIUS * 2)) - SPAWN_RADIUS;
  const dy = dx === 0 && dz === 0 ? 1 : 0;
  return [
    spawnTileCoord[0] + dx,
    spawnTileCoord[1] + dy,
    spawnTileCoord[2] + dz,
  ];
}
