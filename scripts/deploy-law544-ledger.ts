import { network } from "hardhat";

const connection = await network.create();
const { viem } = connection;

const contract = await viem.deployContract("Law544Ledger");
const publicClient = await viem.getPublicClient();
const blockNumber = await publicClient.getBlockNumber();

console.log("Law544Ledger deployed");
console.log(`address=${contract.address}`);
console.log(`network=${connection.networkName}`);
console.log(`blockNumber=${blockNumber}`);

await connection.close();
