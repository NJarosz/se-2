// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoolToken is ERC20Burnable, Ownable {
    uint256 fund = 420_000_000_000_000_000_000;

    mapping(address => bool) public minters;

    constructor() ERC20("CoolToken", "CLTK") {}

    function setMinter(address _minter) public onlyOwner {
        minters[_minter] = !minters[_minter];
    }

    function mint(address _recipient) public {
        require(minters[msg.sender], "only minters can mint");
        _mint(_recipient, fund);
    }

}