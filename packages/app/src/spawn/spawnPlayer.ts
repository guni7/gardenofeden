import { decodePosition, packVec3 } from "@dust/world/internal";
import IWorldAbi from "@dust/world/out/IWorld.sol/IWorld.abi";
import { resourceToHex } from "@latticexyz/common";
import { SPAWN_ENERGY, SPAWN_TILE_ENTITY_ID } from "./constants";
import { getSpawnCoord } from "./getSpawnCoord";
import { decodeError } from "../common/decodeError";

export async function spawnPlayer(
  dustClient: Awaited<ReturnType<typeof import("dustkit/internal").connectDustClient>>
): Promise<{ error?: string }> {
  const spawnTileCoord = decodePosition(SPAWN_TILE_ENTITY_ID);
  const spawnCoord = packVec3(getSpawnCoord(spawnTileCoord));

  const result = await dustClient.provider.request({
    method: "systemCall",
    params: [
      {
        systemId: resourceToHex({
          type: "system",
          namespace: "GardenOfEden",
          name: "SpawnSystem",
        }),
        abi: IWorldAbi,
        functionName: "spawn",
        args: [SPAWN_TILE_ENTITY_ID, spawnCoord, SPAWN_ENERGY, "0x"],
      },
    ],
  });

  const error = decodeError(
    IWorldAbi,
    result.transactionHash ? result.receipt : result.receipt.receipt
  );

  return { error };
}
