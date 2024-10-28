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
        await stateTransition.deployed();

        const ProductRegistrationFactory = (await ethers.getContractFactory(
            "ProductRegistration"
        )) as ProductRegistration__factory;
        productRegistration = await ProductRegistrationFactory.deploy(stateTransition.address);
        await productRegistration.deployed();
    });

    it("should register a product", async function () {
        const productId = 1;
        const rfid = ethers.utils.toUtf8Bytes("rfid_123");
        const name = "Sample Product";
        const origin = 1;

        await productRegistration.registerProduct(productId, rfid, name, origin);
        const product = await productRegistration.getProduct(productId);

        expect(product.id).to.equal(productId);
        expect(product.name).to.equal(name);
        expect(product.origin).to.equal(origin);
        expect(product.owner).to.equal(deployer.address);
    });

    it("should transfer ownership", async function () {
        const productId = 1;
        const rfid = ethers.utils.toUtf8Bytes("rfid_123");
        const newOwner = ethers.Wallet.createRandom().address;

        await productRegistration.transferOwnership(productId, rfid, newOwner);
        const product = await productRegistration.getProduct(productId);

        expect(product.owner).to.equal(newOwner);
    });

    it("should revert if product is already registered", async function () {
        const productId = 1;
        const rfid = ethers.utils.toUtf8Bytes("rfid_123");
        const name = "Sample Product";
        const origin = 1;

        await expect(productRegistration.registerProduct(productId, rfid, name, origin))
            .to.be.revertedWith("Product already registered");
    });

    it("should revert if transferring ownership with incorrect RFID", async function () {
        const productId = 1;
        const incorrectRfid = ethers.utils.toUtf8Bytes("wrong_rfid");
        const newOwner = ethers.Wallet.createRandom().address;

        await expect(productRegistration.transferOwnership(productId, incorrectRfid, newOwner))
            .to.be.revertedWith("Invalid RFID");
    });
});
