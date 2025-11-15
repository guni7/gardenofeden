// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { console } from "forge-std/console.sol";

import { Script } from "./Script.sol";

import { bedProgram } from "../src/codegen/systems/BedProgramLib.sol";
import { fFProgram } from "../src/codegen/systems/FFProgramLib.sol";
import { spawnTileProgram } from "../src/codegen/systems/SpawnTileProgramLib.sol";
import { Admin } from "../src/codegen/tables/Admin.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    StoreSwitch.setStoreAddress(worldAddress);
    startBroadcast();

    // Set the admin address
    address admin = 0xD6756447ea6325b90917f604324B52ccfd6a1e0a;
    Admin.set(admin, true);
    console.log("Set admin address:", admin);

    vm.stopBroadcast();

    if (block.chainid == 31337) {
      console.log("Setting local world address to:", worldAddress);
      _setLocalWorldAddress(worldAddress);
    }
  }

  // Set the world address by directly writing to storage for local setup
  function _setLocalWorldAddress(address worldAddress) internal {
    bytes32 worldSlot = keccak256("mud.store.storage.StoreSwitch");
    bytes32 worldAddressBytes32 = bytes32(uint256(uint160(worldAddress)));
    vm.store(fFProgram.getAddress(), worldSlot, worldAddressBytes32);
    vm.store(spawnTileProgram.getAddress(), worldSlot, worldAddressBytes32);
    vm.store(bedProgram.getAddress(), worldSlot, worldAddressBytes32);
  }
}
