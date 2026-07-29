const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Contest end: one year from deploy time. The promo is effectively
  // open-ended — this can be changed anytime via setContestEnd(uint256),
  // so you never get stranded by a hardcoded deadline again.
  const ONE_YEAR = 365 * 24 * 60 * 60;
  const contestEnd = Math.floor(Date.now() / 1000) + ONE_YEAR;

  console.log("Deploying PromoCredit...");
  console.log("Deployer (becomes owner):", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("contestEnd (unix):", contestEnd, "=>", new Date(contestEnd * 1000).toISOString());

  const PromoCredit = await hre.ethers.getContractFactory("PromoCredit");
  const promoCredit = await PromoCredit.deploy(contestEnd);
  await promoCredit.waitForDeployment();

  const address = await promoCredit.getAddress();
  console.log("\n✅ PromoCredit deployed to:", address);
  console.log("   Owner:", deployer.address);
  console.log("   Set this address in the backend contract config.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
