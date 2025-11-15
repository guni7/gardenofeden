// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { WorldConsumer } from "@latticexyz/world-consumer/src/experimental/WorldConsumer.sol";
import { IEdenToken } from "../IEdenToken.sol";
import { Constants } from "../Constants.sol";

import { System, WorldContextConsumer } from "@latticexyz/world/src/System.sol";
import { BaseProgram } from "../BaseProgram.sol";
/**
 * @title EdenTokenSystem
 * @dev MUD System contract to interact with EdenToken (UUPS proxy)
 * Allows MUD World programs to mint, burn, or transfer EdenToken on behalf of users
 */
contract EdenTokenSystem is System, BaseProgram {
    IEdenToken public immutable edenToken = IEdenToken(0xDE75849E2E500F57FA6f55116C531D0afFEf5E46);

    // Mint tokens to a user (must be authorized in EdenToken)
    function systemMint(address to, uint256 amount) external onlyWorld {
        edenToken.mint(to, amount);
    }

    // Burn tokens from a user (must be authorized in EdenToken)
    function systemBurn(address from, uint256 amount) external onlyWorld {
        edenToken.burn(from, amount);
    }

    // System-level transfer: uses systemTransferFrom, not transferFrom
    function systemTransfer(address from, address to, uint256 amount) external onlyWorld {
        edenToken.systemTransferFrom(from, to, amount);
    }

    // Get the token balance of an address
    function balanceOf(address account) external view returns (uint256) {
        return edenToken.balanceOf(account);
    }

    // Get the total token supply
    function totalSupply() external view returns (uint256) {
        return edenToken.totalSupply();
    }

       // Required due to inheriting from System and WorldConsumer
  function _msgSender() public view override(WorldContextConsumer, BaseProgram) returns (address) {
    return BaseProgram._msgSender();
  }

  function _msgValue() public view override(WorldContextConsumer, BaseProgram) returns (uint256) {
    return BaseProgram._msgValue();
  }
}

