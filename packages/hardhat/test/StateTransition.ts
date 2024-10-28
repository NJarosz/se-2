import { expect } from "chai";
import { ethers } from "hardhat";
import { StateTransition, StateTransition__factory } from "../typechain-types";

describe("StateTransition", function () {
  let stateTransition: StateTransition;
  let deployer: any;
  const nodes = ["Chicago", "New York", "Los Angeles", "Austin", "Miami"];

  before(async function () {
    [deployer] = await ethers.getSigners();
    const StateTransitionFactory = (await ethers.getContractFactory(
      "StateTransition"
    )) as StateTransition__factory;
    stateTransition = await StateTransitionFactory.deploy(nodes);
    await stateTransition.deployed();
  });

  it("should initialize nodes correctly", async function () {
    expect(await stateTransition.supplyChainNodes(0)).to.equal("In Transit");
    expect(await stateTransition.supplyChainNodes(1)).to.equal(nodes[0]);
    expect(await stateTransition.supplyChainNodes(nodes.length + 1)).to.equal("End User");
  });

  it("should update the state of a product", async function () {
    const productId = 1;
    const rfid = ethers.utils.formatBytes32String("rfid_123");
    const newState = 2; // Representing some state, e.g., "In Transit"
    const location = 1; // Corresponding to "Chicago" in nodes

    await stateTransition.updateState(productId, rfid, newState, location);

    const state = await stateTransition.getState(productId);
    expect(state.state).to.equal(newState);
    expect(state.location).to.equal(location);
  });
});
