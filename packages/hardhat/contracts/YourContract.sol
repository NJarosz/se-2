//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract is Ownable {
    
    // mapping(address => uint256) public tokens;
    // address[] public ownedTokens;
    
    event MultiTransfer(address indexed _token, address indexed recipient, uint256 indexed value, address sender);

    function withdraw() onlyOwner public {
        (bool success,) = msg.sender.call{value: address(this).balance}("");
        require(success, "Failed to send Ether");
    }

    function multiSend(
        address[] calldata _to, 
        address[] calldata _tokenAddress,
        uint256[] calldata _value)
        external returns (bool success) {
        require(((_to.length == _tokenAddress.length)), "Invalid Input Data");
        for (uint i = 0; i < _to.length; i++) {
            (IERC20(_tokenAddress[i]).transfer(_to[i], _value[i]));
            emit MultiTransfer(_tokenAddress[i], _to[i], _value[i], msg.sender);
        }
        return true;     
    }
    

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
