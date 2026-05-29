const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying WCCredit...");
  console.log("Deployer:", deployer.address);

  const WCCredit = await hre.ethers.getContractFactory("WCCredit");
  const wcCredit = await WCCredit.deploy();
  await wcCredit.waitForDeployment();

  const address = await wcCredit.getAddress();
  console.log("✅ WCCredit deployed to:", address);
  console.log("Network:", hre.network.name);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
