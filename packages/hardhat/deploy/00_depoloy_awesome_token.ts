// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("AwesomeToken", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
  });
  
  // set minter/ owner to your address

  //const AwesomeToken = await ethers.getContract("AwesomeToken", deployer);
  // const yourAddress = ""
  // await AwesomeToken.setMinter(yourAddress);
  // await AwesomeToken.transferOwnership(yourAddress);
  
  // console.log(yourAddress, " set as a AwesomeToken minter and owner");

};
module.exports.tags = ["AwesomeToken"];