// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./StateTransition.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ProductRegistration is ReentrancyGuard {
	address public immutable STATE_CONTRACT;
	uint constant ID_NOT_SET = 0;

	struct Product {
		uint id;
		bytes24 hashedRfid;
		string name;
		uint origin;
		uint timestamp;
		address owner;
	}

	mapping(uint => Product) public products;

	event ProductRegistered(uint id, string name, uint origin, address owner);
	event OwnershipTransferred(uint id, address newOwner);

	constructor(address _addr) {
		require(_addr != address(0), "State contract address cannot be zero");
		STATE_CONTRACT = _addr;
	}

	function registerProduct(
		uint id,
		bytes24 rfid,
		string memory name,
		uint origin
	) public nonReentrant {
		require(
			products[id].id == ID_NOT_SET,
			"Product with this ID already registered"
		);
		require(id > ID_NOT_SET, "Invalid product ID");
		require(bytes(name).length > ID_NOT_SET, "Product name is required");
		require(rfid.length == 24, "RFID signature must be 24 bytes");

		products[id] = Product(
			id,
			rfid,
			name,
			origin,
			block.timestamp,
			msg.sender
		);

		StateTransition st = StateTransition(STATE_CONTRACT);
		st.updateState(id, rfid, StateTransition.State.Created, origin);
		emit ProductRegistered(id, name, origin, msg.sender);
	}

	function transferOwnership(
		uint id,
		string memory password,
		address newOwner
	) public nonReentrant {
		require(
			products[id].owner == msg.sender,
			"Only owner can change ownership"
		);
		require(
			products[id].hashedRfid ==
				bytes24(keccak256(abi.encodePacked(password))),
			"Invalid Password"
		);
		require(newOwner != address(0), "New owner address cannot be zero");

		products[id].owner = newOwner;
		emit OwnershipTransferred(id, newOwner);
	}

	function getProduct(uint id) public view returns (Product memory) {
		require(products[id].id != ID_NOT_SET, "No Product Registered");
		return products[id];
	}
}
