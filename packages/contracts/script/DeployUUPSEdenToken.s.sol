// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import { EdenToken } from "../src/EdenToken.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployUUPSRGToken is Script {
    // Set your initialization parameters here
    string internal name = "Token of Eden";
    string internal symbol = "EDEN";
    address internal initialOwner = 0x230A60363591cd828c6E52fC5Ad941b9ba065A70; // update if needed

    function run() external {
        vm.startBroadcast();

        // 1. Deploy the RGToken implementation

        EdenToken implementation = new EdenToken();

        // 2. Encode the initializer call
        bytes memory data = abi.encodeWithSelector(
            EdenToken.initialize.selector,
            name,
            symbol,
            initialOwner
        );

        // 3. Deploy the UUPS proxy (ERC1967Proxy)
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), data);

        console.log("UUPS EdenToken deployed at:", address(proxy));
        console.log("Implementation at:", address(implementation));

        vm.stopBroadcast();
    }
}
