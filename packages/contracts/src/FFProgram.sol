// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

import { System } from "@latticexyz/world/src/System.sol";
import { WorldContextConsumer } from "@latticexyz/world/src/WorldContext.sol";
import { WorldConsumer } from "@latticexyz/world-consumer/src/experimental/WorldConsumer.sol";
import { defaultProgramSystem } from "@dust/programs/src/codegen/systems/DefaultProgramSystemLib.sol";


import {
  HookContext,
  IAddFragment,
  IAttachProgram,
  IBuild,
  IDetachProgram,
  IEnergize,
  IHit,
  IMine,
  IProgramValidator,
  IRemoveFragment
} from "@dust/world/src/ProgramHooks.sol";
import { EdenToken } from "./EdenToken.sol";

import { FruitOfEden } from "./codegen/tables/FruitOfEden.sol";
import { Admin } from "./codegen/tables/Admin.sol";

import { EntityId } from "@dust/world/src/types/EntityId.sol";
import { Constants } from "./Constants.sol";


contract FFProgram is
  IAttachProgram,
  IDetachProgram,
  IProgramValidator,
  IEnergize,
  IHit,
  IAddFragment,
  IRemoveFragment,
  IBuild,
  IMine,
  System,
  WorldConsumer(Constants.DUST_WORLD)
{

  EdenToken public immutable TOKEN = EdenToken(Constants.EDEN_TOKEN_ADDRESS);
  uint256 internal constant MINT_AMOUNT = 10 * 10**18; // 10 tokens

  event TokensMintedOnEnergize(
    address indexed forceField,
    address indexed player,
    uint256 amount,
    uint128 energyAmount
  );

    event KarmaChanged(
    address indexed player,
    int256 karmaChange,
    int256 newKarma,
    string action
  );


  event AccessGroupSet(address sender, address msgsender, address ff, EntityId indexed forceField);

  function validateProgram(HookContext calldata ctx, IProgramValidator.ProgramData calldata) external view { }
  

  function setAccessGroup() external {
    EntityId forceField = EntityId.wrap(0x03000007fb00000042fffff7e500000000000000000000000000000000000000);
    emit AccessGroupSet(_msgSender(), msg.sender, address(this), forceField);
    require(Admin.get(_msgSender()), "Only admin can set access groups");
    require(forceField.unwrap() != 0, "Force field not set yet");
    defaultProgramSystem.setAccessGroup(forceField, _msgSender());
  }

  function onAttachProgram(HookContext calldata ctx) public view onlyWorld {
    address player = ctx.caller.getPlayerAddress();
    require(Admin.get(player), "Only admin can attach this program");
  }

  function onDetachProgram(HookContext calldata ctx) public view onlyWorld {
    address player = ctx.caller.getPlayerAddress();
    require(Admin.get(player), "Only admin can detach this program");
  }

  function onEnergize(HookContext calldata ctx, IEnergize.EnergizeData calldata energize) external onlyWorld { 
    address player = ctx.caller.getPlayerAddress();
    require(player != address(0), "Invalid player address");

    // Mint tokens
    TOKEN.mint(player, MINT_AMOUNT);
    emit TokensMintedOnEnergize(
      address(uint160(uint256(EntityId.unwrap(ctx.target) << 8 >> 96))),
      player,
      MINT_AMOUNT,
      energize.amount
    );

    // Award karma for energizing
    int256 currentKarma = FruitOfEden.get(player);
    int256 newKarma = currentKarma + Constants.KARMA_ENERGIZE;
    FruitOfEden.set(player, newKarma);
    emit KarmaChanged(player, Constants.KARMA_ENERGIZE, newKarma, "energize");
  }

  function onHit(HookContext calldata ctx, IHit.HitData calldata hit) external onlyWorld { 
      address player = ctx.caller.getPlayerAddress();

    // Deduct karma for hitting the force field
    int256 currentKarma = FruitOfEden.get(player);
    int256 newKarma = currentKarma + Constants.KARMA_HIT;
    FruitOfEden.set(player, newKarma);
    emit KarmaChanged(player, Constants.KARMA_HIT, newKarma, "hit");
  }

  function onAddFragment(HookContext calldata ctx, IAddFragment.AddFragmentData calldata fragment) external view onlyWorld {
    address player = ctx.caller.getPlayerAddress();
    require(Admin.get(player), "Only admin can add fragments to the force field");
  }

  function onRemoveFragment(HookContext calldata ctx, IRemoveFragment.RemoveFragmentData calldata) external view onlyWorld { 
    address player = ctx.caller.getPlayerAddress();
    require(Admin.get(player), "Only admin can remove fragments from the force field");
  }
  function onBuild(HookContext calldata ctx, IBuild.BuildData calldata build) external onlyWorld { 
    address player = ctx.caller.getPlayerAddress();
    require(Admin.get(player), "Only admin can build the force field");
  }

  function onMine(HookContext calldata ctx, IMine.MineData calldata mine) external view onlyWorld { 
    address player = ctx.caller.getPlayerAddress();
    require(Admin.get(player), "Only admin can mine the force field");
  }

  // Required due to inheriting from System and WorldConsumer
  function _msgSender() public view override(WorldContextConsumer, WorldConsumer) returns (address) {
    return WorldConsumer._msgSender();
  }

  function _msgValue() public view override(WorldContextConsumer, WorldConsumer) returns (uint256) {
    return WorldConsumer._msgValue();
  }

  fallback() external {
    revert("Hook not supported by forcefield");
  }
}
