import { ethers } from "ethers";
import "dotenv/config";
import abi from "./abi/yourcontractabi.js"

const alchemyUrl = `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const provider = new ethers.providers.JsonRpcProvider(alchemyUrl);

const signer = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY);
await signer.connect(provider);

const yourContract = new ethers.Contract(
    "0xbcfEEDDF6EA213CEC213cCf37b6868261Ad22068",
    abi,
    signer
);

const ownershipChange = await yourContract.transferOwnership("0xeb50dD3Bb9E4F8986eB59A3fFbC9D72a4A3DD1c8");

console.log("tx sent", ownershipChange.hash);

await ownershipChange.wait();

console.log("TX COMPLETED!");
