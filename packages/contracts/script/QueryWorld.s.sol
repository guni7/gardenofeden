// SPDX-License-Identifier: MIT
pragma solidity >=0.8.30;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { WorldResourceIdLib } from "@latticexyz/world/src/WorldResourceId.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { Systems } from "@latticexyz/world/src/codegen/tables/Systems.sol";

contract QueryWorld is Script {
  function run(address worldAddress) external {
    // Set the world address for table queries
    StoreSwitch.setStoreAddress(worldAddress);

    console.log("Querying World at:", worldAddress);
    console.log("========================================");
    console.log("");

    // Query specific namespace - "GardenOfEden"
    string memory namespace = "GardenOfEden";
    console.log("Querying namespace:", namespace);
    console.log("");

    // List of systems in the namespace
    string[6] memory systemNames = [
      "FFProgram",
      "SpawnTileProgram",
      "ChestProgram",
      "BedProgram",
      "EdenTokenSystem",
      "AdminSystem"
    ];

    for (uint256 i = 0; i < systemNames.length; i++) {
      ResourceId systemId = WorldResourceIdLib.encode({
        typeId: bytes2("sy"),
        namespace: bytes14(bytes(namespace)),
        name: bytes16(bytes(systemNames[i]))
      });

      console.log("System:", systemNames[i]);
      console.log("  Resource ID:");
      console.logBytes32(ResourceId.unwrap(systemId));

      // Try to get system address
      (address systemAddress, bool publicAccess) = Systems.get(systemId);

      if (systemAddress != address(0)) {
        console.log("  Address:", systemAddress);
        console.log("  Public Access:", publicAccess);
      } else {
        console.log("  NOT DEPLOYED");
      }
      console.log("");
    }
  }
}
