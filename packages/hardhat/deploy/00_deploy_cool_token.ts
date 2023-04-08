// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("CoolToken", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
  });
  
  
  // set minter/ owner to your address

  //const CoolToken = await ethers.getContract("CoolToken", deployer);
  // const yourAddress = ""
  // await CoolToken.setMinter(yourAddress);
  // await CoolToken.transferOwnership(yourAddress);
  
  // console.log(yourAddress, " set as a CoolToken minter and owner");

};
module.exports.tags = ["CoolToken"];