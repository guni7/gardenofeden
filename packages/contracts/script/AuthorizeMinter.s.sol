// SPDX-License-Identifier: MIT
pragma solidity >=0.8.20;

import { Script } from "./Script.sol";
import { EdenToken } from "../src/EdenToken.sol";
import { Constants } from "../src/Constants.sol";

contract AuthorizeMinter is Script {
  function run() external {
    vm.startBroadcast();
    EdenToken(Constants.EDEN_TOKEN_ADDRESS).authorizeMinter(0xee4b0d8fd2901611c34A23e9327E2E531DbdDde3);
    vm.stopBroadcast();
  }
}