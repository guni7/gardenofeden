// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

import { IWorld } from "@dust/world/src/codegen/world/IWorld.sol";

library Constants {
  address internal constant DUST_ADDRESS = 0x253eb85B3C953bFE3827CC14a151262482E7189C;
  IWorld internal constant DUST_WORLD = IWorld(DUST_ADDRESS);

  int256 internal constant KARMA_ENERGIZE = 5;  // Karma gained per energize action
  int256 internal constant KARMA_HIT = -5;       // Karma lost per hit action

  address internal constant EDEN_TOKEN_ADDRESS = 0xDE75849E2E500F57FA6f55116C531D0afFEf5E46;

  uint256 internal constant FREE_SPAWNS = 3;
  uint256 internal constant SPAWN_COST = 50 ether;

  uint128 internal constant MAX_SPAWN_ENERGY = 245280000000000000;
  uint128 internal constant ALLOWED_SPAWN_ENERGY = (MAX_SPAWN_ENERGY * 2) / 3;

  // Set this to the correct EdenToken address for your deployment

}
