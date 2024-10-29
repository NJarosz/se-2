import { expect } from "chai";
import { ethers } from "hardhat";
import { ProductRegistration, StateTransition, ProductRegistration__factory, StateTransition__factory } from "../typechain-types";

describe("ProductRegistration", function () {
    let productRegistration: ProductRegistration;
    let stateTransition: StateTransition;
    let deployer: any;
    const nodes = ["Chicago", "New York", "Los Angeles", "Austin", "Miami"];

    before(async function () {
        [deployer] = await ethers.getSigners();

        const StateTransitionFactory = (await ethers.getContractFactory(
            "StateTransition"
        )) as StateTransition__factory;
        stateTransition = await StateTransitionFactory.deploy(nodes);
        await stateTransition.waitForDeployment();

        const ProductRegistrationFactory = (await ethers.getContractFactory(
            "ProductRegistration"
        )) as ProductRegistration__factory;
        productRegistration = await ProductRegistrationFactory.deploy(stateTransition.getAddress());
        await productRegistration.waitForDeployment();
    });

    it("should initialize nodes correctly", async function () {
        expect(await stateTransition.supplyChainNodes(0)).to.equal("In Transit");
        expect(await stateTransition.supplyChainNodes(1)).to.equal(nodes[0]);
        expect(await stateTransition.supplyChainNodes(nodes.length + 1)).to.equal("End User");
    });

    it("should register a product", async function () {
        const productId = 123;
        const rfid = ethers.zeroPadBytes("0x277e1969dea33bae62441f1ac9b13d25deaf90acd10850150b604d9535d44138", 32);
        const name = "Sample Product";
        const origin = 1;

        await productRegistration.registerProduct(productId, rfid, name, origin);
        const product = await productRegistration.getProduct(productId);

        expect(product.id).to.equal(productId);
        expect(product.name).to.equal(name);
        expect(product.origin).to.equal(origin);
        expect(product.owner).to.equal(deployer.address);
    });

    it("should update the state of a product", async function () {
        const productId = 1;
        const rfid = ethers.zeroPadBytes("0x277e1969dea33bae62441f1ac9b13d25deaf90acd10850150b604d9535d44138", 32);
        const newState = 3; // Representing some state, e.g., "Received"
        const location = 2; // Corresponding to "New York" in nodes

        await stateTransition.updateState(productId, rfid, newState, location);

        const state = await stateTransition.getState(productId);
        expect(state.state).to.equal(newState);
        expect(state.location).to.equal(await stateTransition.supplyChainNodes(location));
    });

    it("should revert if product is already registered", async function () {
        const productId = 123;
        const rfid = ethers.zeroPadBytes("0x277e1969dea33bae62441f1ac9b13d25deaf90acd10850150b604d9535d44138", 32);
        const name = "Sample Product";
        const origin = 1;

        await expect(productRegistration.registerProduct(productId, rfid, name, origin))
            .to.be.revertedWith("Product already registered");
    });

    it("should revert if transferring ownership with incorrect RFID", async function () {
        const productId = 123;
        const incorrectRfid = ethers.zeroPadBytes("0x377e1969dea33bae62441f1ac9b13d25deaf90acd10850150b604d9535d44138", 32);
        const newOwner = ethers.Wallet.createRandom().address;

        await expect(productRegistration.transferOwnership(productId, incorrectRfid, newOwner))
            .to.be.revertedWith("Invalid RFID");
    });

    it("should transfer ownership", async function () {
        const productId = 123;
        const rfid = ethers.zeroPadBytes("0x277e1969dea33bae62441f1ac9b13d25deaf90acd10850150b604d9535d44138", 32);
        const newOwner = ethers.Wallet.createRandom().address;

        await productRegistration.transferOwnership(productId, rfid, newOwner);
        const product = await productRegistration.getProduct(productId);

        expect(product.owner).to.equal(newOwner);
    });
});
