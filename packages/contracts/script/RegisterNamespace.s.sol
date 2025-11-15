// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

import { ResourceId, WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { ResourceIds } from "@latticexyz/store/src/codegen/tables/ResourceIds.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { console } from "forge-std/console.sol";
import { Script } from "./Script.sol";

interface IWorld {
  function registerNamespace(ResourceId namespaceId) external;
}

contract RegisterNamespace is Script {
  function run(address worldAddress) external {
    StoreSwitch.setStoreAddress(worldAddress);

    startBroadcast();

    IWorld world = IWorld(worldAddress);

    // Register the GardenOfEden namespace
    ResourceId namespaceId = WorldResourceIdLib.encodeNamespace(bytes14("GardenOfEden"));

    if (!ResourceIds.getExists(namespaceId)) {
      console.log("Registering namespace: GardenOfEden");
      world.registerNamespace(namespaceId);
      console.log("Namespace registered successfully!");
    } else {
      console.log("Namespace GardenOfEden already registered");
    }

    vm.stopBroadcast();
  }
}
