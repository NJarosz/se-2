// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract StateTransition is Initializable {
	enum State {
		Created,
		Storage,
		Shipped,
		Received
	}

	struct ProductState {
		uint id;
		bytes32 secret;
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

	constructor(string[] memory nodes) {
		supplyChainNodes[0] = "In Transit";
		nodeCount = nodes.length + 1;
		for (uint i = 1; i <= nodes.length; ) {
			supplyChainNodes[i] = nodes[i - 1];
			++i;
		}
		supplyChainNodes[nodes.length + 1] = "End User";
	}

	function updateState(
		uint id,
		bytes memory rfid,
		State newState,
		uint location
	) public {
		bytes32 secret = keccak256(abi.encodePacked(rfid));
		if (productStates[id].id != 0) {
			require(productStates[id].secret == secret, "Improper RFID");
		}
		productStates[id] = ProductState(
			id,
			secret,
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

	function getState(uint id) public view returns (ProductState memory) {
		return productStates[id];
	}

	function fetchNodes()
		public
		view
		returns (uint[] memory ids, string[] memory nodes)
	{
		string[] memory _nodes = new string[](nodeCount + 1);
		uint[] memory _ids = new uint[](nodeCount + 1);
		for (uint256 i = 0; i <= nodeCount; ) {
			_ids[i] = i;
			_nodes[i] = supplyChainNodes[i];
			++i;
		}
		return (_ids, _nodes);
	}
}
