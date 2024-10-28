// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StateTransition {
	uint constant NOT_REGISTERED = 0;

	enum State {
		Created,
		Storage,
		Shipped,
		Received
	}

	struct ProductState {
		uint id;
		bytes32 hashedRfid;
		State state;
		string location;
		uint timestamp;
	}

	uint public nodeCount;
	mapping(uint => string) public supplyChainNodes;
	mapping(uint => ProductState) public productStates;

	event ProductStateUpdated(
		uint id,
		State newState,
		string location,
		uint timestamp
	);

	// Constructor populates supply chain nodes and provides nodeCount
	constructor(string[] memory nodes) {
		supplyChainNodes[0] = "In Transit";
		nodeCount = nodes.length + 2; // Adding 2 for "In Transit" and "End User"
		for (uint i = 1; i <= nodes.length; i++) {
			supplyChainNodes[i] = nodes[i - 1];
		}
		supplyChainNodes[nodes.length + 1] = "End User";
	}

	// This function is used to update the current state of a proudct.
	function updateState(
		uint id,
		bytes memory rfid,
		State newState,
		uint location
	) public {
		bytes32 hashed = keccak256(abi.encodePacked(rfid)); // Hashes the RFID hash

		require(
			productStates[id].id != NOT_REGISTERED,
			"Product not registered"
		);
		require(productStates[id].hashedRfid == hashed, "Invalid RFID");
		require(location < nodeCount, "Invalid location");
		// Enforce that if the new state is Shipped, the location must be 0
		if (newState == State.Shipped) {
			require(
				location == 0,
				"Location must be 0 (In Transit) when status is Shipped"
			);
		}
		productStates[id] = ProductState(
			id,
			hashed,
			newState,
			supplyChainNodes[location],
			block.timestamp
		);

		emit ProductStateUpdated(
			id,
			newState,
			supplyChainNodes[location],
			block.timestamp
		);
	}

	// Returns the current state based on the Product ID
	function getState(uint id) public view returns (ProductState memory) {
		return productStates[id];
	}

	// Returns a list of all the Nodes and their indices
	function fetchNodes()
		public
		view
		returns (uint[] memory ids, string[] memory nodes)
	{
		uint[] memory _ids = new uint[](nodeCount);
		string[] memory _nodes = new string[](nodeCount);
		for (uint256 i = 0; i < nodeCount; i++) {
			_ids[i] = i;
			_nodes[i] = supplyChainNodes[i];
		}
		return (_ids, _nodes);
	}
}
