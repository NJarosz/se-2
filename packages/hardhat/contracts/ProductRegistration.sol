//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./StateTransition.sol";

contract ProductRegistration is Initializable {
	address public stateContract;

	struct Product {
		uint id;
		bytes32 secret;
		string name;
		uint origin;
		uint timestamp;
		address owner;
	}

	mapping(uint => Product) public products;

	event ProductRegistered(uint id, string name, uint origin, address owner);

	constructor(address _addr) {
		stateContract = _addr;
	}

	function registerProduct(
		uint id,
		bytes memory rfid,
		string memory name,
		uint origin
	) public {
		require(products[id].id == 0, "Product already registered");
		products[id] = Product(
			id,
			keccak256(abi.encodePacked(rfid)),
			name,
			origin,
			block.timestamp,
			msg.sender
		);
		StateTransition st = StateTransition(stateContract);
		st.updateState(id, rfid, StateTransition.State.Created, origin);
		emit ProductRegistered(id, name, origin, msg.sender);
	}

	function transferOwnership(
		uint id,
		bytes memory rfid,
		address new_owner
	) public {
		require(
			products[id].owner == msg.sender,
			"Only owner can change ownership"
		);
		require(
			products[id].secret == keccak256(abi.encodePacked(rfid)),
			"Invalid RFID"
		);
		products[id].owner = new_owner;
	}

	function getProduct(uint id) public view returns (Product memory) {
		require(products[id].id != 0, "No Product Registered");
		return products[id];
	}
}
