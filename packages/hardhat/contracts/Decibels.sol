pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Decibels is ERC20Burnable, Ownable {
    uint256 peaking = 1_000_000_000_000_000_000_000;
    constructor(address _owner) ERC20("Decibels", "DBS") {
         _mint(_owner, 1_000_000_000_000_000_000_000_000_000); // Mint 1,000,000,000 tokens to the contract deployer
        
    }

    function isPeaking(address pro) public view returns (bool) {
        return balanceOf(pro) >= peaking;
    }
}