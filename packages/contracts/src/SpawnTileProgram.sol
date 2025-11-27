// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System, WorldContextConsumer } from "@latticexyz/world/src/System.sol";

import { HookContext, ISpawn, IProgramValidator } from "@dust/world/src/ProgramHooks.sol";

import { BaseProgram } from "./BaseProgram.sol";

import { EdenToken } from "./EdenToken.sol";

import { SpawnCount } from "./codegen/tables/SpawnCount.sol";
import { Admin } from "./codegen/tables/Admin.sol";

import { Constants } from "./Constants.sol";
import { ObjectTypes } from "@dust/world/src/types/ObjectType.sol";

contract SpawnTileProgram is ISpawn, IProgramValidator, System, BaseProgram {

  EdenToken public immutable EDEN = EdenToken(Constants.EDEN_TOKEN_ADDRESS);

  function onAttachProgram(HookContext calldata ctx) public view override onlyWorld {
    address player = ctx.caller.getPlayerAddress();
    require(Admin.get(player), "Only admin can attach this program");

    require(ctx.target.getObjectType() == ObjectTypes.SpawnTile, "Target must be a spawn tile");
  }

  function onDetachProgram(HookContext calldata ctx) public view override onlyWorld {
    // NOTE: we don't care about revertOnFailure because we are not modifying any state
    address player = ctx.caller.getPlayerAddress();
    require(Admin.get(player), "Only admin can detach this program");
  }

  function validateProgram(HookContext calldata ctx, IProgramValidator.ProgramData calldata) external view {
    // Only admins can attach programs to entities within the spawn tile's area
    if (ctx.revertOnFailure) {
      address player = ctx.caller.getPlayerAddress();
      require(Admin.get(player), "Only admin can attach programs in spawn area");
    }
  }




  function onSpawn(HookContext calldata ctx, ISpawn.SpawnData calldata spawn) external onlyWorld {
    address player = ctx.caller.getPlayerAddress();
    uint32 count = SpawnCount.get(player);

    // Check spawn energy - must be at or below 2/3 of max
    require(spawn.energy <= Constants.ALLOWED_SPAWN_ENERGY, "Spawn Energy too high");

    if (count >= Constants.FREE_SPAWNS) {
      // Player must hold enough EDEN tokens to spawn
      require(EDEN.balanceOf(player) >= Constants.SPAWN_COST, "Not enough EDEN Tokens");
      // Burn the tokens
      EDEN.burn(player, Constants.SPAWN_COST);
    }

    SpawnCount.set(player, count + 1);
  }
  // Required due to inheriting from System and WorldConsumer
  function _msgSender() public view override(WorldContextConsumer, BaseProgram) returns (address) {
    return BaseProgram._msgSender();
  }

  function _msgValue() public view override(WorldContextConsumer, BaseProgram) returns (uint256) {
    return BaseProgram._msgValue();
  }
}
